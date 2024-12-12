import ApplicationInstanceService from "../../domain/services/application";
import EntitiesService from "../../domain/services/entities";
import { IApplicationDbData, IApplicationWfContext, IApplicationWfData } from "../../types/interfaces/IApplicationInstance";

class GetSingleApplicationUseCase {

    private readonly applicationInstance: ApplicationInstanceService
    private readonly entitiesService: EntitiesService

    constructor() {
        this.applicationInstance = new ApplicationInstanceService()
        this.entitiesService = new EntitiesService()
    }

    public async getSingleApplication(id: string): Promise<any> {
        console.log(">>> GetSingleApplicationUseCase");
        const appWfInstance: IApplicationWfData = await this.applicationInstance.getSingle(id)
        const appDbData: IApplicationDbData = await this.entitiesService.getApplicationData(appWfInstance.instance.id)
        return {
            ...appDbData,
            wf: this.processContext(appWfInstance) //wf: { ...appWfInstance }
        }
    }

    private processContext(appWfInstance: IApplicationWfData): any {
        const context: IApplicationWfContext = appWfInstance.context
        let approversWithStatus = {
            "nivel1": {},
            "nivel2": {},
            "nivel3": {},
            "nivel4": {}
        }

        const allApprovers = context.allApprovers
        
        if(context.operacionNivel1){
            approversWithStatus.nivel1 = context.operacionNivel1
        }
        else approversWithStatus.nivel1 = {
            "pendingApprovers": allApprovers.NIVEL1
        }

        if(context.operacionNivel2){
            approversWithStatus.nivel2 = context.operacionNivel2
        }
        else approversWithStatus.nivel2 = {
            "pendingApprovers": allApprovers.NIVEL2
        }

        if(context.operacionNivel3){
            approversWithStatus.nivel3 = context.operacionNivel3
        }
        else approversWithStatus.nivel3 = {
            "pendingApprovers": allApprovers.NIVEL3
        }

        if(context.operacionNivel4){
            approversWithStatus.nivel4 = context.operacionNivel4
        }
        else approversWithStatus.nivel4 = {
            "pendingApprovers": allApprovers.NIVEL4
        }
      

        return {
            instance: appWfInstance.instance,
            context: {
                "approvers": approversWithStatus
            }
        }
    }
}

export default GetSingleApplicationUseCase