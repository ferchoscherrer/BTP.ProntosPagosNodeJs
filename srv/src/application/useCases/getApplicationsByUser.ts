import ApplicationInstanceService from "../../domain/services/application"
import EntitiesService from "../../domain/services/entities"
import { IApplication } from "../../types/interfaces/IApplicationInstance"

class GetUserApplicationsUseCase {

    private applicationService: ApplicationInstanceService
    private entitiesService: EntitiesService

    constructor() {
        this.applicationService = new ApplicationInstanceService()
        this.entitiesService = new EntitiesService()
    }

    // TODO variable "a" jajajaja
    public async getApplications(user: string): Promise<IApplication[]> {
        console.log(">>> GetUserApplicationsUseCase");
        const applications = await this.applicationService.getAll()
        const applicationsByUser = applications.filter(a => a.context.user === user)
        const applicationsData = <IApplication[]> []
        for (const a of applicationsByUser) {
            const applicationData = await Promise.resolve(
                this.entitiesService.getApplicationData(a.instance.id)
            )
            applicationsData.push({
                ...applicationData,
                wf: { ...a }
            })
        }
        return applicationsData
    }
}

export default GetUserApplicationsUseCase