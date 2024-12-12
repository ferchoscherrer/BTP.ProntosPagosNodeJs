import { WF_INSTANCE_STATUS } from "../../types/enums";
import { IAllApproverContext } from "../../types/interfaces/IAllApproverContext";
import { IApplicationWfContext, IApplicationWfInstance } from "../../types/interfaces/IApplicationInstance";
import IApplicationRepository from "../../types/interfaces/IApplicationRepository";
import { IContextChangeState } from "../../types/interfaces/IContextChangeState";
import { IRejectParams } from "../../types/interfaces/IRejectParams";
import ITask from "../../types/interfaces/ITask";
import SapAxios from "../../utils/sapAxios";
import Application from "../entities/Application";

class WorkflowRepository implements IApplicationRepository {

    private readonly destination: string = process.env.DESTINATION_WORKFLOW;
    private readonly definitionID: string = process.env.WORKFLOW_DEFINITION_ID;

    constructor() { }

    // TODO add data on input
    public async createApplication(appInstanceToCreate: Application, allApprovers: IAllApproverContext): Promise<IApplicationWfInstance> {
        console.log(">>> WorkflowRepository - createApplicationInstance");
        try {
            const axios = new SapAxios(this.destination)
            const body = {
                definitionId: this.definitionID,
                context: {
                    mailSolicitante: appInstanceToCreate.getUser(),
                    idSolicitud: appInstanceToCreate.getID(),
                    idSufijo: appInstanceToCreate.getSuffix(),
                    creationUser: appInstanceToCreate.getUser(),
                    creationUserName: appInstanceToCreate.getUserName(),
                    creationDate: (new Date()).toISOString().split('T')[0],
                    areaSolicitante: appInstanceToCreate.getAreaSolicitante(),
                    input: {
                        referencia: appInstanceToCreate.getReferencia(),
                        sociedad: appInstanceToCreate.getSociety(),
                        usuario: appInstanceToCreate.getUser(),
                        documento: appInstanceToCreate.getDocument(),
                        proveedor: appInstanceToCreate.getSupplier(),
                        ceco: appInstanceToCreate.getCeco(),
                        monto: appInstanceToCreate.getMoney(),
                        archivo: appInstanceToCreate.getFiled(),
                        fechaPago: appInstanceToCreate.getPaymentDate(),
                        motivo: appInstanceToCreate.getReason(),
                        sociedadDesc: appInstanceToCreate.getSocietyDesc(),
                        proveedorDesc: appInstanceToCreate.getSupplierDesc(),
                        moneda: appInstanceToCreate.getMoneda()
                    },
                    allApprovers: allApprovers
                }
            }
            console.log(`Body:`, body);
            const res = await axios.post("/v1/workflow-instances", body)
            console.log(`Response:`, res.data);
            return {
                id: res.data.id,
                status: res.data.status,
                subject: res.data.subject,
                startedAt: res.data.startedAt,
                completedAt: res.data.completedAt
            }
        }
        catch (err) {
            throw err
        }
    }

    public async getApplications(filters: any): Promise<IApplicationWfInstance[]> {
        console.log(">>> WorkflowRepository - getApplicationInstances");
        try {
            const axios = new SapAxios(this.destination)
            const path = `/v1/workflow-instances`
            const params = {
                $expand: "attributes",
                definitionId: this.definitionID,
            }

            if (filters?.status) {
                params["status"] = filters.status
            }

            const res = await axios.get(path, params)
            console.log(`Response entries:`, res.data.length);
            const applicationInstances = <IApplicationWfInstance[]>res.data.map((appInstance: any) => ({
                id: appInstance.id,
                subject: appInstance.subject,
                status: appInstance.status,
                startedAt: appInstance.startedAt,
                completedAt: appInstance.completedAt,
            }))
            return applicationInstances
        }
        catch (err) {
            throw err
        }
    }

    public async getNextRequestID(requestID: any): Promise<Number> {
        console.log(">>> WorkflowRepository - getNextRequestID");
        try {
            const axios = new SapAxios(this.destination)
            const path = `/PRONTOS_PAGOS/get_max_version_by_id.xsjs`
            const params = {
                solicitud: requestID,
            }

            const res = await axios.get(path, params)
            console.log(`Respuesta de Next Suffix Id:`, res.data);

            return res.data.solicitud_version
        }
        catch (err) {
            throw err
        }
    }

    public async getApplicationsByUser(user: string): Promise<IApplicationWfInstance[]> {
        console.log(">>> WorkflowRepository - getApplicationInstances");
        try {
            const axios = new SapAxios(this.destination)
            const path = `/v1/workflow-instances`
            let params = {
                $expand: "attributes",
                ["attributes.creationUser"]: user
            }

            const res = await axios.get(path, params)
            console.log(`Response entries:`, res.data.length);
            const applicationInstances = <IApplicationWfInstance[]>res.data.map((appInstance: any) => ({
                id: appInstance.id,
                subject: appInstance.subject,
                status: appInstance.status,
                startedAt: appInstance.startedAt,
                completedAt: appInstance.completedAt,
            }))
            return applicationInstances
        }
        catch (err) {
            throw err
        }
    }

    public async getSingleApplication(id: string): Promise<IApplicationWfInstance> {
        try {
            console.log(">>> WorkflowRepository - getSingleApplicationInstance");
            const axios = new SapAxios(this.destination)
            const path = `/v1/workflow-instances/${id}`
            const res = await axios.get(path)
            console.log("Response: ", res.data);
            return {
                id: res.data.id,
                subject: res.data.subject,
                status: res.data.status,
                startedAt: res.data.startedAt,
                completedAt: res.data.completedAt
            }
        }
        catch (err) {
            if (err.response.status === 404) {
                err.statusCode = 404
            }
            throw err;
        }
    }

    // TODO add data to get?
    public async getSingleApplicationContext(id: string): Promise<IApplicationWfContext> {
        try {
            console.log(">>> WorkflowRepository - getSingleApplicationInstanceContext");
            const axios = new SapAxios(this.destination)
            const path = `/v1/workflow-instances/${id}/context`
            const res = await axios.get(path)
            console.log("Response: ", res.data);
            return {
                applicantID: res.data?.idSolicitud,
                suffix: res.data?.idSufijo,
                applicantEmail: res.data?.mailSolicitante,
                society: res.data?.input?.sociedad,
                user: res.data?.input?.usuario,
                document: res.data?.input?.documento,
                supplier: res.data?.input?.proveedor,
                ceco: res.data?.input?.ceco,
                amount: res.data?.input?.monto,
                filed: res.data?.input?.archivo,
                paymentDay: res.data?.input?.fechaPago,
                reason: res.data?.input?.motivo,
                sociedadDesc: res.data?.input?.sociedadDesc,
                proveedorDesc: res.data?.input?.proveedorDesc,
                moneda: res.data?.input?.moneda,
                areaSolicitante: res.data?.areaSolicitante,
                referencia: res.data?.referencia,
                allApprovers: res.data?.allApprovers || null,
                operacionNivel1: res.data?.operacionNivel1 || null,
                operacionNivel2: res.data?.operacionNivel2 || null,
                operacionNivel3: res.data?.operacionNivel3 || null,
                operacionNivel4: res.data?.operacionNivel4 || null,
                approversNivel1: res.data?.approversNivel1,
                approversNivel2: res.data?.approversNivel2,
                approversNivel3: res.data?.approversNivel3,
                approversNivel4: res.data?.approversNivel4
            }
        }
        catch (err) {
            if (err.response?.status === 404) {
                err.statusCode = 404
            }
            throw err;
        }
    }

    public async cancelApplication(id: string, contextToCancel: IContextChangeState): Promise<any> {
        console.log(">>> WorkflowRepository - cancelApplicationInstance");
        try {
            const axios = new SapAxios(this.destination)
            const path = `/v1/task-instances/${id}`
            const body = { status: WF_INSTANCE_STATUS.COMPLETED, context: contextToCancel }
            const res = await axios.patch(path, body)
            console.log(`Response: `, res.status);
        }
        catch (err) {
            if (err.response.status === 404) {
                err.statusCode = 404
            }
            throw err
        }
    }

    public async rejectApplication(id: string, contextToReject: IContextChangeState): Promise<any> {
        console.log(">>> WorkflowRepository - rejectApplicationInstance");
        try {
            const axios = new SapAxios(this.destination)
            const path = `/v1/task-instances/${id}`
            const body = { status: WF_INSTANCE_STATUS.COMPLETED, context: contextToReject }
            const res = await axios.patch(path, body)
            console.log(`Response: `, res.status);
        }
        catch (err) {
            if (err.response.status === 404) {
                err.statusCode = 404
            }
            throw err
        }
    }

    public async getCurrentLevelById(id: string): Promise<any> {
        console.log(">>> WorkflowRepository - getCurrentLevelById");
        try {
            const axios = new SapAxios(this.destination)
            const path = `/v1/task-instances/${id}/attributes`
            const res = await axios.get(path)
            console.log(`Response: `, res.data);
            return res.data[0].value
        }
        catch (err) {
            if (err.response.status === 404) {
                err.statusCode = 404
            }
            throw err
        }
    }

    public async approveApplicationLevel(taskId: string, contextAprrove: IContextChangeState): Promise<any> {
        console.log(">>> WorkflowRepository - approveApplicationLevel");
        try {
            const axios = new SapAxios(this.destination)
            const path = `/v1/task-instances/${taskId}`
            console.log(contextAprrove)
            const body = { status: WF_INSTANCE_STATUS.COMPLETED, context: contextAprrove }
            const res = await axios.patch(path, body)
            console.log(`Response: `, res.status);
        }
        catch (err) {
            if (err.response.status === 400) {
                err.statusCode = 400
            }
            throw err
        }
    }

    public async addApproverPerLevelToTask(taskId: string, level: string): Promise<any> {
        console.log(">>> WorkflowRepository - approveApplicationLevel");
        try {
            const axios = new SapAxios(this.destination)
            const path = `/v1/task-instances/${taskId}`
            const body = { status: WF_INSTANCE_STATUS.COMPLETED }
            const res = await axios.patch(path, body)
            console.log(`Response: `, res.status);
        }
        catch (err) {
            if (err.response.status === 400) {
                err.statusCode = 400
            }
            throw err
        }
    }

    public async getApplicationLevels(id: string, filters: any): Promise<any> {
        console.log(">>> WorkflowRepository - getApplicationInstanceLevels");
        try {
            const axios = new SapAxios(this.destination)
            const path = `/v1/task-instances`
            const params = {
                workflowInstanceId: id,
            }

            if (filters?.approvers) {
                const approvers = <string[]>filters?.approvers
                const query = approvers.join(",")
                params["recipientUsers"] = query
            }

            const res = await axios.get(path, params)
            console.log(`Response: `, res.data);
            return res.data
        }
        catch (err) {
            if (err.response.status === 404) {
                err.statusCode = 404
            }
            throw err
        }
    }

    public async getAllTask(id: string): Promise<any> {
        console.log(">>> WorkflowRepository - getApplicationInstanceLevels");
        try {
            const axios = new SapAxios(this.destination)
            const path = `/v1/task-instances`
            const params = {
                workflowInstanceId: id,
                $expand: "attributes",
            }

            const res = await axios.get(path, params)
            console.log(`Response: `, res.data);
            return res.data
        }
        catch (err) {
            if (err.response.status === 404) {
                err.statusCode = 404
            }
            throw err
        }
    }

    public async setApproversToTask(approversMail: string[], taskId: string) {
        console.log(">>> WorkflowRepository - setApproversToTask");
        try {
            const axios = new SapAxios(this.destination)
            const path = `/v1/task-instances/${taskId}`
            const res = await axios.patch(path, {
                recipientUsers: approversMail.join(",")
            })
            console.log(`Response: `, res.status);
            return res.data
        }
        catch (err) {
            if (err.response.status === 404) {
                err.statusCode = 404
            }
            throw err
        }
    }
}

export default WorkflowRepository