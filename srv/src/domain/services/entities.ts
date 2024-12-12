import { HANA_APPLICATION_STATUS } from "../../types/enums";
import { IApplicationDbData } from "../../types/interfaces/IApplicationInstance";
import { IApplicationEntity, IApprover, IArea } from "../../types/interfaces/IEntitiesInstance";
import IEntitiesRepository from "../../types/interfaces/IEntitiesRepository";
import HanaEntitiesRepository from "../repositories/hanaOnPremiseEntities.repository";

class EntitiesService {

    private entitiesRepository: IEntitiesRepository

    constructor() {
        this.entitiesRepository = new HanaEntitiesRepository()
    }

    public async getAreaByDesc(area: string): Promise<IArea> {
        console.log(">>> EntitiesService - getAreaByDesc");
        const res = await this.entitiesRepository.getAreaByDesc(area)
        return res
    }

    public async getRequestStatusId(requestId: number, suffix: number): Promise<any> {
        console.log(">>> EntitiesService - getRequestStatusId");
        const res = await this.entitiesRepository.getRequestStatusId(requestId, suffix)
        return res
    }
    public async getNextSuffixId(requestId: number): Promise<number> {
        console.log(">>> EntitiesService - getNextSuffixId");
        const res = await this.entitiesRepository.getNextSuffixId(requestId)
        return res
    }

    public async getApprovers(filters: any): Promise<IApprover[]> {
        console.log(">>> EntitiesService - getApprovers");
        const res = await this.entitiesRepository.getApprovers(filters)
        return res
    }

    public async getNextId(): Promise<number> {
        console.log(">>> EntitiesService - getNextId");
        const id = await this.entitiesRepository.getNextId()
        console.log("nextId: " + id);
        return id
    }

    public async createApplication(body: IApplicationEntity): Promise<any> {
        console.log(">>> EntitiesService - createApplication");
        const application = await this.entitiesRepository.createApplication(body)
        // await this.entitiesRepository.createStateApplicationRelation(
        //     HANA_APPLICATION_STATUS.APPROVEMENT_PENDING, body.ID_SOLICITUD, body.FECHA, body.USUARIO
        // )
        return application
    }

    public async changeCurrentApprover(mailApprover: string, requestId: number, suffix: number): Promise<any> {
        console.log(">>> EntitiesService - changeCurrentApprover");
        await this.entitiesRepository.changeCurrentApprover(mailApprover, requestId, suffix)
    }

    public async changeLauncherstatus(requestId: number, suffix: number, launchID: number): Promise<any> {
        console.log(">>> EntitiesService - changeLauncherstatus");
        await this.entitiesRepository.changeLauncherstatus(requestId, suffix, launchID)
    }

    public async getApplicationData(id: string): Promise<IApplicationDbData> {
        console.log(">>> EntitiesService - getApplicationData");
        const application = await this.entitiesRepository.getApplicationData(id)
        return application
    }

    public async getLaunchId(requestId: number, suffixId: number): Promise<any> {
        console.log(">>> EntitiesService - getApplicationData");
        const relanzandoId = await this.entitiesRepository.getLauncherId(requestId, suffixId)
        return relanzandoId
    }


    public async getAllData(id: string): Promise<IApplicationEntity> {
        console.log(">>> EntitiesService - getAllData");
        const application = await this.entitiesRepository.getAllData(id)
        return application
    }

    public async setStateApplicationRelation(applicationId: number, suffixId: number, stateId: HANA_APPLICATION_STATUS) {
        console.log(">>> EntitiesService - setStateApplicationRelation " + HANA_APPLICATION_STATUS);
        await this.entitiesRepository.changeStateApplication(applicationId, suffixId, stateId)
    }
}

export default EntitiesService