import { Response } from "express";
import CreateApplicationUseCase from "../../application/useCases/createApplication";
import GetApplicationsUseCase from "../../application/useCases/getApplications";
import GetUserApplicationsUseCase from "../../application/useCases/getApplicationsByUser";
import GetApplicationsToApproveUseCase from "../../application/useCases/getApplicationsToApprove";
import GetSingleApplicationUseCase from "../../application/useCases/getSingleApplication"; "../../application/useCases/getSingleApplicationInstance";
import ApproveApplicationLevelUseCase from "../../application/useCases/approveApplicationLevel";
import { IApplication, IApplicationToCreate } from "../../types/interfaces/IApplicationInstance";
import IAuthRequest from "../../types/interfaces/IAuthRequest";
import { validateApplicationToCreate } from "../validations/applicationSchema";
import { ZodError } from "zod";
import CancelApplicationUseCase from "../../application/useCases/cancelApplication";
import RejectApplicationUseCase from "../../application/useCases/rejectApplication";
import { IApproveParams } from "../../types/interfaces/IApproveParams";
import { IRejectParams } from "../../types/interfaces/IRejectParams";
import GetApproversUseCase from "../../application/useCases/getApprovers";
import UseCaseError from "../../application/Errors/UseCaseError";

// FMS inicio
import { Request} from "express";
import EntitiesService from "../../domain/services/entities";
//FMS fin

class ApplicationController {

    private readonly createApplicationUseCase: CreateApplicationUseCase
    private readonly getApproversUseCase: GetApproversUseCase
    private readonly getApplicationsUseCase: GetApplicationsUseCase
    private readonly getSingleApplicationUseCase: GetSingleApplicationUseCase
    private readonly approveApplicationLevelUseCase: ApproveApplicationLevelUseCase
    private readonly cancelApplicationUseCase: CancelApplicationUseCase
    private readonly getApplicationsByUser: GetUserApplicationsUseCase
    private readonly getApplicationsToApproveUseCase: GetApplicationsToApproveUseCase
    private readonly rejectApplicationUseCase: RejectApplicationUseCase
    //FMS inicio
    private readonly entitiesService: EntitiesService;
    //FMS fin
    constructor() {
        this.createApplicationUseCase = new CreateApplicationUseCase()
        this.getApproversUseCase = new GetApproversUseCase()
        this.getApplicationsUseCase = new GetApplicationsUseCase()
        this.getSingleApplicationUseCase = new GetSingleApplicationUseCase()
        this.approveApplicationLevelUseCase = new ApproveApplicationLevelUseCase()
        this.cancelApplicationUseCase = new CancelApplicationUseCase()
        this.getApplicationsByUser = new GetUserApplicationsUseCase()
        this.getApplicationsToApproveUseCase = new GetApplicationsToApproveUseCase()
        this.rejectApplicationUseCase = new RejectApplicationUseCase()
        //FMS inicio
        this.entitiesService = new EntitiesService();
        //FMS fin
    }

    public async createApplication(req: IAuthRequest, res: Response): Promise<void> {
        console.log(">>> ApplicationController - createApplication");
        try {
            const payload: IApplicationToCreate = req.body
            const user = req.user.emails[0].value
            const name = `${req.user.name.givenName} ${req.user.name.familyName}`

            await validateApplicationToCreate(payload)

            const appInstance: IApplication = await this.createApplicationUseCase.createApplication(payload, user, name)
            res.status(201).json(appInstance)
        }
        catch (err) {
            console.error(err)
            if (err instanceof ZodError) {
                res.status(400).json({ error: `${err.errors[0].message}` })
            }
            if (err instanceof UseCaseError) {
                res.status(400).json({ error: `${err.message}` })
            }
            else {
                res.status(400).send("Internal server error.")
            }
        }
    }

    public async getApplications(_req: IAuthRequest, res: Response): Promise<void> {
        console.log(">>> ApplicationController - getApplications");
        try {
            const appInstances: IApplication[] = await this.getApplicationsUseCase.getApplications()
            res.status(200).json({ items: appInstances })
        } catch (err) {
            console.error(err)
            res.status(500).send("Internal server error.")
        }
    }

    public async getOwnApplications(req: IAuthRequest, res: Response): Promise<void> {
        console.log(">>> ApplicationController - getOwnApplications");
        try {
            const user = req.user.emails[0].value
            const appInstances: IApplication[] = await this.getApplicationsByUser.getApplications(user)
            res.status(200).json({ items: appInstances })
        } catch (err) {
            console.error(err)
            res.status(500).send("Internal server error.")
        }
    }

    public async getApplicationsToApprove(req: IAuthRequest, res: Response): Promise<void> {
        console.log(">>> ApplicationController - getApplicationsToApprove");
        try {
            const user = req.user.emails[0].value
            const appInstances: IApplication[] = await this.getApplicationsToApproveUseCase.getApplications(user)
            res.status(200).json({ items: appInstances })
        } catch (err) {
            console.error(err)
            res.status(500).send("Internal server error.")
        }
    }

    public async getApprovers(req: IAuthRequest, res: Response): Promise<void> {
        console.log(">>> ApplicationController - getApplicationsToApprove");
        try {
            const { id } = req.params
            const approvers = await this.getApproversUseCase.getApprovers(id)
            res.status(200).json({ approvers: approvers })
        } catch (err) {
            console.error(err)
            res.status(500).send("Internal server error.")
        }
    }

    public async getSingleApplication(req: IAuthRequest, res: Response): Promise<void> {
        console.log(">>> ApplicationController - getSingleApplication");
        try {
            const { id } = req.params
            const appInstance = await this.getSingleApplicationUseCase.getSingleApplication(id)
            res.status(200).json(appInstance)
        }
        catch (err) {
            console.error(err)
            if (err.statusCode === 404) {
                res.status(404).send("No application instance matches with this ID.")
            }
            else {
                res.status(500).send("Internal server error.")
            }
        }
    }

    public async approveApplicationLevel(req: IAuthRequest, res: Response) {
        console.log(">>> ApplicationController - approveApplicationLevel");
        try {
            const { id } = req.params
            const user = req.user.emails[0].value
            const name = `${req.user.name.givenName} ${req.user.name.familyName}`
            const IApproverParamas: IApproveParams = { approverName: name, approverMail: user, reason: req.body.reason }
            console.log(req.user)
            const state = await this.approveApplicationLevelUseCase.approveLevel(id, IApproverParamas)
            res.status(200).json({ state: state })
        }
        catch (err) {
            console.error(err)
            if (err.statusCode === 400) {
                res.status(400).send("This application instance already has a final status.")
            }
            else if (err.statusCode === 404) {
                res.status(404).send("This application instance does not exists.")
            }
            else {
                res.status(500).send("Internal server error.")
            }
        }
    }

    public async cancelApplication(req: IAuthRequest, res: Response): Promise<void> {
        console.log(">>> ApplicationController - cancelApplication");
        try {
            const { id } = req.params
            const user = req.user.emails[0].value
            const name = `${req.user.name.givenName} ${req.user.name.familyName}`
            const IRejectParams: IRejectParams = { approverName: name, approverMail: user, reason: req.body.reason }
            const state = await this.cancelApplicationUseCase.cancelApplication(id, IRejectParams)
            res.status(200).json({ state: state })
        }
        catch (err) {
            console.error(err)
            if (err.statusCode === 404) {
                res.status(404).send("Given application ID does not match with a RUNNING instance. Check if application exists or it has a final status.")
            }
            else {
                res.status(500).send("Internal server error.")
            }
        }
    }

    public async rejectApplication(req: IAuthRequest, res: Response): Promise<void> {
        console.log(">>> ApplicationController - rejectApplication");
        try {
            const { id } = req.params
            const user = req.user.emails[0].value
            const name = `${req.user.name.givenName} ${req.user.name.familyName}`

            console.log("body", req.body)

            const reason = req.body.reason
            console.log("reason", reason)

            const IRejectParams: IRejectParams = { approverName: name, approverMail: user, reason: reason }
            const state = await this.rejectApplicationUseCase.rejectApplication(id, IRejectParams)
            res.status(200).json({ state: state })
        }
        catch (err) {
            console.error(err)
            if (err.statusCode === 404) {
                res.status(404).send("Given application ID does not match with a RUNNING instance. Check if application exists or it has a final status.")
            }
            else {
                res.status(500).send("Internal server error.")
            }
        }
    }


    // FMS inicio
    //metodo para obtener todas las solicitudes de todos los usuarios, solo para el admin
// En tu srv/src/infraestructure/controllers/application.controller.ts

public getAllApplicationsForAdmin = async (req: Request, res: Response) => {
    // 1. Esto confirma si la petición entró al servidor Node.js
    console.log(">>> [DEBUG] Entró a getAllApplicationsForAdmin");
    
    try {
        console.log(">>> [DEBUG] Intentando llamar a entitiesService.getApplications()");
        const applications = await this.entitiesService.getApplications(); 
        
        // 2. Esto confirma si el servicio respondió algo
        console.log(">>> [DEBUG] Datos recibidos del servicio. Cantidad: ", applications ? applications.length : "NULO");
        
        res.status(200).json(applications);
    } catch (error) {
        // 3. Esto es vital: si falla, veremos el error real en los logs
        console.error(">>> [ERROR] Fallo en el proceso:", error);
        res.status(500).json({ error: "Error interno" });
    }
};

}

export default ApplicationController