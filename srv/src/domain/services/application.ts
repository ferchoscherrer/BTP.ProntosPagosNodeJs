import { WF_INSTANCE_STATUS } from "../../types/enums";
import { IAllApproverContext } from "../../types/interfaces/IAllApproverContext";
import { IApplicationContext } from "../../types/interfaces/IApplicationContext";
import { IApplicationWfData, IApplicationWfContext, IApplicationWfInstance, IApplicationToCreate } from "../../types/interfaces/IApplicationInstance";
import IApplicationRepository from "../../types/interfaces/IApplicationRepository";
import { IContextChangeState } from "../../types/interfaces/IContextChangeState";
import { IRejectParams } from "../../types/interfaces/IRejectParams";
import ITask from "../../types/interfaces/ITask";
import Application from "../entities/Application";
import WorkflowRepository from "../repositories/wfApplication.repository"

class ApplicationInstanceService {

    private applicationRepository: IApplicationRepository

    constructor() {
        this.applicationRepository = new WorkflowRepository()
    }

    public async create(payload: IApplicationToCreate, suffix: number, user: string, username: string, allApprovers: IAllApproverContext, id: number): Promise<IApplicationWfData> {
        console.log(">>> Application Instance Service");

        let appInstanceToCreate: Application = Application.convertFromPayload(
            { ...payload, ID: id },
            user,
            username
        )
        appInstanceToCreate.setSuffix(suffix.toString())
        // CREO INSTANCIA DE WORKFLOW
        const appInstanceData: IApplicationWfInstance = await this.applicationRepository.createApplication(appInstanceToCreate, allApprovers)

        // OBTENGO CONTEXTO DE LA INSTANCIA DE WORKFLOW
        const appInstanceContext: IApplicationWfContext = await this.applicationRepository.getSingleApplicationContext(appInstanceData.id)
        return { instance: appInstanceData, context: appInstanceContext }
    }

    public async getAll(): Promise<IApplicationWfData[]> {
        console.log(">>> Application Instance Service");
        // OBTENGO INSTANCIAS
        const appInstances = await this.applicationRepository.getApplications()
        const applicationInstancesWithContext: IApplicationWfData[] = []
        // PARA CADA UNA DE LAS INSTANCIAS TRAIGO EL CONTEXTO
        for (const appInstance of appInstances) {
            const context = await Promise.resolve(
                this.applicationRepository.getSingleApplicationContext(appInstance.id)
            )
            applicationInstancesWithContext.push({
                instance: appInstance,
                context
            })
        }
        return applicationInstancesWithContext
    }

    public async getNextRequestID(requestId: number): Promise<number> {
        return this.applicationRepository.getNextRequestID(requestId)
    }

    public async getAllTask(workflowId: string): Promise<[]> {
        console.log(">>> Application Instance Service");
        return await this.applicationRepository.getAllTask(workflowId)
    }


    public async getApplicationByUser(user: string): Promise<IApplicationWfData[]> {
        console.log(">>> Application Instance Service");
        // OBTENGO INSTANCIAS
        const appInstances = await this.applicationRepository.getApplications(user)
        const applicationInstancesWithContext: IApplicationWfData[] = []
        // PARA CADA UNA DE LAS INSTANCIAS TRAIGO EL CONTEXTO
        for (const appInstance of appInstances) {
            const context = await Promise.resolve(
                this.applicationRepository.getSingleApplicationContext(appInstance.id)
            )
            applicationInstancesWithContext.push({
                instance: appInstance,
                context
            })
        }
        return applicationInstancesWithContext
    }


    public async getAllByStatus(status: WF_INSTANCE_STATUS): Promise<IApplicationWfData[]> {
        console.log(">>> Application Instance Service");
        // OBTENGO INSTANCIAS EN CURSO
        const appInstances = await this.applicationRepository.getApplications({ status })
        const applicationInstancesWithContext: IApplicationWfData[] = []
        // PARA CADA UNA DE LAS INSTANCIAS TRAIGO EL CONTEXTO
        for (const appInstance of appInstances) {
            const context = await Promise.resolve(
                this.applicationRepository.getSingleApplicationContext(appInstance.id)
            )
            applicationInstancesWithContext.push({
                instance: appInstance,
                context
            })
        }
        return applicationInstancesWithContext
    }

    public async getSingle(id: string): Promise<IApplicationWfData> {
        console.log(">>> Application Instance Service");
        const appInstanceData = await this.applicationRepository.getSingleApplication(id)
        const appInstanceContext = await this.applicationRepository.getSingleApplicationContext(id)
        return {
            instance: appInstanceData,
            context: appInstanceContext
        }
    }

    public async getApplicationContext(id: string): Promise<IApplicationWfContext> {
        console.log(">>> Application Instance Service");
        const appInstanceContext = await this.applicationRepository.getSingleApplicationContext(id)
        return appInstanceContext
    }

    public async cancel(id: string, contextToCancel: IContextChangeState): Promise<any> {
        console.log(">>> Application Instance Service");
        await this.applicationRepository.cancelApplication(id, contextToCancel)
    }

    public async reject(id: string, contextToReject: IContextChangeState): Promise<any> {
        console.log(">>> Application Instance Service");
        await this.applicationRepository.rejectApplication(id, contextToReject)
    }

    public async approveLevel(idTask: string, contextAprrove: IContextChangeState): Promise<any> {
        console.log(">>> Application Instance Service");
        await this.applicationRepository.approveApplicationLevel(idTask, contextAprrove)
        //TO DO get approvers by level. Modificar el contexto ir agregando niveles de mail aprobador
    }

    public async getCurrentLevelById(id: string): Promise<any> {
        console.log(">>> Application Instance Service");
        return await this.applicationRepository.getCurrentLevelById(id)

    }

    public async setApproversToLevel(approversMail: string[], taskId: string) {
        console.log(">>> Application Instance Service");
        await this.applicationRepository.setApproversToTask(approversMail, taskId);
    }

    public async getInstanceApprovementLevels(id: string, filters: any = {}): Promise<any> {
        console.log(">>> Application Instance Service");
        const levels = await this.applicationRepository.getApplicationLevels(id, filters)
        return levels
    }
}

export default ApplicationInstanceService