import ApplicationInstanceService from "../../domain/services/application";
import EntitiesService from "../../domain/services/entities";
import { HANA_APPLICATION_STATUS } from "../../types/enums";
import { IApplicationDbData } from "../../types/interfaces/IApplicationInstance";
import { IContextChangeState } from "../../types/interfaces/IContextChangeState";
import { IRejectParams } from "../../types/interfaces/IRejectParams";
import ITask from "../../types/interfaces/ITask";

class CancelApplicationUseCase {

    private readonly applicationInstance: ApplicationInstanceService
    private readonly entitiesServicie: EntitiesService

    constructor() {
        this.applicationInstance = new ApplicationInstanceService()
        this.entitiesServicie = new EntitiesService()
    }

    public async cancelApplication(id: string, cancelParams: IRejectParams): Promise<HANA_APPLICATION_STATUS> {
        console.log(">>> CancelApplicationUseCase");

        const toState = HANA_APPLICATION_STATUS.CANCELED
        const applicationWf: IApplicationDbData = await this.entitiesServicie.getApplicationData(id)
        const applicationId = applicationWf.id
        const suffix = applicationWf.suffix
        let getAllTask: ITask[] = await this.applicationInstance.getAllTask(id);
        console.log(getAllTask)
        let currentTask: ITask = this.getLastTask(getAllTask)
        console.log(currentTask)
        let contextToCancel: IContextChangeState =
        {
            [`operacionNivel${currentTask.attributes[0].value}`]: {
                "nombreResponsable": cancelParams.approverName,
                "mailResponsable": cancelParams.approverMail,
                "fechaOperacion": (new Date()).toISOString().split('T')[0],
                "observaciones": cancelParams.reason,
                "accion": "C"
            }
        }

        try {
            await this.applicationInstance.cancel(currentTask.id, contextToCancel),
            await this.entitiesServicie.setStateApplicationRelation(applicationId, suffix, toState)
        }
        catch (err) {
            throw err
        }

        return toState
    }

    private getLastTask(tasks: ITask[]): ITask {
        return tasks.reduce((prevTask, currentTask) => {
            return (prevTask.createdAt > currentTask.createdAt) ? prevTask : currentTask
        }, tasks[0])
    }
}

export default CancelApplicationUseCase