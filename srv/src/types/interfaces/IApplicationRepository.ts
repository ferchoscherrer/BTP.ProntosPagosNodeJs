import Application from "../../domain/entities/Application";
import { IAllApproverContext } from "./IAllApproverContext";
import { IApplicationWfContext } from "./IApplicationInstance";
import { IContextChangeState } from "./IContextChangeState";
import { IRejectParams } from "./IRejectParams";
import ITask from "./ITask";

export default interface IApplicationRepository {
    getAllTask(workflowId: string): any
    getNextRequestID(requestId: number): any
    createApplication(appInstanceToCreate: Application, allApprovers: IAllApproverContext): any
    getApplications(filters?: any): any
    getSingleApplication(id: string): any
    getSingleApplicationContext(id: string): any
    cancelApplication(id: string, contextToCancel: IContextChangeState): any
    rejectApplication(id: string, contextToReject: IContextChangeState): any
    approveApplicationLevel(taskId: string, contextAprrove: IContextChangeState): any
    getApplicationLevels(id: string, filters?: any): any
    getCurrentLevelById(id: string): any
    setApproversToTask(approversMail: string[], taskId: string): any
}