import ApplicationInstanceService from "../../domain/services/application";
import EntitiesService from "../../domain/services/entities";
import { HANA_APPLICATION_STATUS } from "../../types/enums";
import { IApplicationDbData } from "../../types/interfaces/IApplicationInstance";
import { IContextChangeState } from "../../types/interfaces/IContextChangeState";
import { IRejectParams } from "../../types/interfaces/IRejectParams";
import ITask from "../../types/interfaces/ITask";

class RejectApplicationUseCase {

    private readonly applicationInstance: ApplicationInstanceService
    private readonly entitiesServicie: EntitiesService

    constructor() {
        this.applicationInstance = new ApplicationInstanceService()
        this.entitiesServicie = new EntitiesService()
    }

    public async rejectApplication(id: string, rejectParams: IRejectParams): Promise<HANA_APPLICATION_STATUS> {
        console.log(">>> RejectApplicationInstanceUseCase: " + JSON.stringify(rejectParams))

        const toState = HANA_APPLICATION_STATUS.REJECTED
        const applicationWf: IApplicationDbData = await this.entitiesServicie.getApplicationData(id)
        const applicationId = applicationWf.id
        const suffix = applicationWf.suffix

        console.log(`Request ${applicationWf.id}, Suffix ${suffix} a rechazar`)
        let getAllTask: ITask[] = await this.applicationInstance.getAllTask(id)
        console.log(getAllTask)
        let currentTask: ITask = this.getLastTask(getAllTask)
        console.log(currentTask)
        let contextToReject: IContextChangeState =
        {
            [`operacionNivel${currentTask.attributes[0].value}`]: {
                "nombreResponsable": rejectParams.approverName,
                "mailResponsable": rejectParams.approverMail,
                "fechaOperacion": (new Date()).toISOString().split('T')[0],
                "observaciones": rejectParams.reason,
                "accion": "R"
            }
        }
        console.log("contextToReject", JSON.stringify(contextToReject))

        try {
            await this.applicationInstance.reject(currentTask.id, contextToReject),
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

export default RejectApplicationUseCase