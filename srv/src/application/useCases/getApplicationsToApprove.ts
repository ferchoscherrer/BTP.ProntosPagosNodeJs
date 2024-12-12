import ApplicationInstanceService from "../../domain/services/application"
import EntitiesService from "../../domain/services/entities"
import { WF_INSTANCE_STATUS } from "../../types/enums"
import { IApplication } from "../../types/interfaces/IApplicationInstance"

class GetApplicationsToApproveUseCase {

    private applicationService: ApplicationInstanceService
    private entitiesService: EntitiesService

    constructor() {
        this.applicationService = new ApplicationInstanceService()
        this.entitiesService = new EntitiesService()
    }

    public async getApplications(user: string): Promise<IApplication[]> {
        console.log(">>> GetApplicationsToApproveUseCase");
        // GET PENDING APPLICATIONS
        const applications = await this.applicationService.getAllByStatus(WF_INSTANCE_STATUS.RUNNING)
        const applicationsToApprove = <IApplication[]> []
        for (const a of applications) {
            // FILTER APPROVEMENT LEVELS BY STATUS AND USER
            const levelsToApprove: any[] = await Promise.resolve(
                this.applicationService.getInstanceApprovementLevels(a.instance.id, {
                    approvers: [user]
                })
            )
            // CHECK IF BELONGS TO USER (APPROVER)
            if (levelsToApprove && levelsToApprove.length > 0) {
                const applicationData = await Promise.resolve(
                    this.entitiesService.getApplicationData(a.instance.id)
                )
                applicationsToApprove.push({
                    ...applicationData,
                    wf: { ...a }
                })
            }
        }
        return applicationsToApprove
    }
}

export default GetApplicationsToApproveUseCase