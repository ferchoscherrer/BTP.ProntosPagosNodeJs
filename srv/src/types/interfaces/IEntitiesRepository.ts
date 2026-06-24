import { IApplicationEntity, IApprover, IArea } from "./IEntitiesInstance";

export default interface IEntitiesRepository {
    changeCurrentApprover(mailApprover: string, requestId: number, suffix: number): Promise<any>
    changeLauncherstatus(applicationId: number, suffix: number, launchId: number,): Promise<any>
    getLauncherId(requestId: number, suffixId: number): Promise<any>
    getAllData(id: string): Promise<IApplicationEntity>;
    getAreaByDesc(description: string): Promise<IArea>
    getApprovers(filters?: any): Promise<IApprover[]>
    getRequestStatusId(requestId: number,suffix:number): Promise<any>
    createApplication(body: IApplicationEntity): Promise<any>
    changeStateApplication(applicationId: number, suffixId: number, stateId: number,): Promise<any>
    getApplications(): Promise<any[]>
    getApplicationData(workflowId: string): Promise<any>
    getNextId(): Promise<number>
    getNextSuffixId(requestId: number): Promise<number>
    //FMS inicio
    //checkExistingApplication(document: string, society: string, aniocontable: string, apuntecontable: string): Promise<boolean>;
    checkExistingApplication(document: string, society: string, aniocontable: string, apuntecontable: string): Promise<any[]>;
    //FMS fin
}