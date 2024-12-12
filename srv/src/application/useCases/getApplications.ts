import ApplicationInstanceService from "../../domain/services/application";
import EntitiesService from "../../domain/services/entities";
import { IApplication } from "../../types/interfaces/IApplicationInstance";

class GetApplicationsUseCase {

    private readonly applicationInstance: ApplicationInstanceService
    private readonly entitiesService: EntitiesService

    constructor() {
        this.applicationInstance = new ApplicationInstanceService()
        this.entitiesService = new EntitiesService()
    }

    public async getApplications(): Promise<IApplication[]> {
        console.log(">>> GetApplicationsUseCase");
        // GET APPLICATIONS DATA FROM WORKFLOW
        const appWfInstances = await this.applicationInstance.getAll()
        const appInstances = <IApplication[]> []
        // GET DATA FROM DATABASE
        for (const a of appWfInstances) {
            const applicationData = await Promise.resolve(
                this.entitiesService.getApplicationData(a.instance.id)
            )
            appInstances.push({
                ...applicationData,
                wf: { ...a }
            })
        }
        return appInstances
    }
}

export default GetApplicationsUseCase