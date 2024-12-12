import ApplicationInstanceService from "../../domain/services/application";
import { IApplicationWfContext } from "../../types/interfaces/IApplicationInstance";

class GetApproversUseCase {

    private readonly applicationInstance: ApplicationInstanceService
    constructor() {
        this.applicationInstance = new ApplicationInstanceService()
    }


    // TODO create entity
    private getLevel(level: Number, operationLevelContext): any {
        return {
            level: level,
            name: operationLevelContext.nombreResponsable,
            mail: operationLevelContext.mailResponsable,
            date: operationLevelContext.fechaOperacion,
            observation: operationLevelContext.observaciones,
            status: operationLevelContext.accion
        }
    }

    public async getApprovers(instanceId: string): Promise<any> {
        console.log(">>> Get Approvers LevelUseCase")
        let context: IApplicationWfContext = await this.applicationInstance.getApplicationContext(instanceId)
        let approversWithStatus = []
        
        if(context.operacionNivel1)
        {
            approversWithStatus.push(this.getLevel(1, context.operacionNivel1))
        }
        if(context.operacionNivel2)
        {
            approversWithStatus.push(this.getLevel(2, context.operacionNivel2))
        }
        if(context.operacionNivel3)
        {
            approversWithStatus.push(this.getLevel(3, context.operacionNivel3))
        }
        if(context.operacionNivel4)
        {
            approversWithStatus.push(this.getLevel(4, context.operacionNivel4))
        }

        return approversWithStatus
    }


}

export default GetApproversUseCase