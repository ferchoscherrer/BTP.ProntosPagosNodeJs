import ApplicationInstanceService from "../../domain/services/application";
import EntitiesService from "../../domain/services/entities";
import { HANA_APPLICATION_STATUS } from "../../types/enums";
import { IAllApproverContext } from "../../types/interfaces/IAllApproverContext";
import { IApplicationWfData, IApplicationToCreate, IApplication } from "../../types/interfaces/IApplicationInstance";
import ITask from "../../types/interfaces/ITask";
import UseCaseError from "../Errors/UseCaseError";

class CreateApplicationUseCase {

    private readonly applicationInstance: ApplicationInstanceService
    private readonly entitiesService: EntitiesService

    constructor() {
        this.applicationInstance = new ApplicationInstanceService()
        this.entitiesService = new EntitiesService()
    }

    public async createApplication(payload: IApplicationToCreate, user: string, username: string): Promise<IApplication> {
        console.log(">>> CreateApplicationUseCase");

        //FMS inicio 
    //     const isDuplicate = await this.entitiesService.checkExistingApplication(
    //     payload.document, 
    //     payload.society, 
    //     payload.aniocontable, 
    //     payload.apuntecontable
    // );
    // if (isDuplicate) {
    //     throw new UseCaseError("Ya existe una solicitud de pronto pago en proceso para este documento.");
    // }

    const activeRequests = await this.entitiesService.checkExistingApplication(
    payload.document, 
    payload.society, 
    payload.aniocontable, 
    payload.apuntecontable
);

// Evaluamos si el array tiene elementos
if (activeRequests && activeRequests.length > 0) {
    const ids = activeRequests
        .map(req => {
            const fechaLegible = this.formatDate(req.FECHA);
            const estadoDesc = this.getStatusDescription(Number(req.ID_ESTADO));
            return `• ID: ${req.ID_SOLICITUD} (v${req.SOLICITUD_VERSION}) | Estado: ${estadoDesc} | Fecha: ${fechaLegible} | Ref: ${req.REFERENCIA}`;
    }).join("\n");
        
    throw new UseCaseError(`Ya existen solicitudes en proceso para este documento:\n${ids}\n\nPor favor, revisa estas solicitudes antes de crear una nueva.`);
}
//FMS fin

        // TODO
        //this.validateMoneyRanges(Number(payload.money))
        payload.money = this.formatNumberWithTwoDecimals(payload.money)
        // Get user area
        const userAreaDesc = payload.areasolicitante
        console.log('userAreaDesc: ', userAreaDesc)
        // suffix
        let requestId: number
        let suffix: number



        // /suffix

        if (userAreaDesc === null || userAreaDesc === "" || userAreaDesc === undefined) {
            throw new UseCaseError("El usuario no tiene un area asociada.");
        }

        const area = await this.entitiesService.getAreaByDesc(userAreaDesc)
        console.log('area: ', area)

        if (area === null || !area.ID_AREA || area.ID_AREA === null || area.ID_AREA === undefined) {
            throw new UseCaseError('No se encuentra el área ' + userAreaDesc)
        }

        let approverLevel1 = await this.entitiesService.getApprovers({
            ID_NIVEL: 1,
            ID_AREA: area.ID_AREA
        })
        console.log('Aprobadores Nivel 1: ', approverLevel1)

        if (!approverLevel1 || approverLevel1.length === 0) {
            throw new UseCaseError('No se encuentra aprobador para el área ' + userAreaDesc)
        }

        let approverLevel1Mail: string = `|${approverLevel1[0].MAIL}|`
        console.log('Mail Nivel 1: ', approverLevel1Mail)

        // Get approver by area and level 1.
        let allApprovers: IAllApproverContext = {
            NIVEL1: approverLevel1,
            NIVEL2: await this.entitiesService.getApprovers({
                ID_NIVEL: 2,
            }),
            NIVEL3: [],
            NIVEL4: await this.entitiesService.getApprovers({
                ID_NIVEL: 4,
            })
        }

        let approversLevel3 = await this.entitiesService.getApprovers({
            ID_NIVEL: 3,
        })
        console.log('Aprobadores Nivel 3: ', approversLevel3)
        allApprovers.NIVEL3.push(approversLevel3.find((approver) => { return Number(approver.MONTO.MONTO_MINIMO_NIVEL) <= Number(payload.money) && Number(approver.MONTO.MONTO_MAXIMO_NIVEL) >= Number(payload.money) }))


        requestId = await this.getRequestId(payload.requestId)
        suffix = await this.getSuffixId(payload.suffix, payload.requestId)
        console.log("Antes de crear ID Solicitud y Sufijo:")
        console.log(payload.requestId)
        console.log(payload.suffix)


        if (suffix !== 1) {
            console.log("Payload Request Id", payload.requestId)
            console.log("Payload Suffix Id", payload.suffix)

            let requestStatus: number = await this.entitiesService.getRequestStatusId(payload.requestId, payload.suffix)
            console.log("requestStatus", requestStatus)
            if (requestStatus !== 2) {
                throw new UseCaseError("La solicitud tiene que estar rechazada para ser relanzada")
            }
            await this.entitiesService.changeLauncherstatus(payload.requestId, payload.suffix, 1)
        }
        // Create new wf instance.
        const appInstance: IApplicationWfData = await this.applicationInstance.create(payload, suffix, user, username, allApprovers, requestId)

        // Create new application and state-application db entity.
        const appDbData = await this.entitiesService.createApplication(
            {
                APROBADOR_ACTUAL: approverLevel1Mail,
                ID_ESTADO: HANA_APPLICATION_STATUS.APPROVEMENT_PENDING,
                ID_SOLICITUD: requestId,
                SOLICITUD_VERSION: suffix,
                ID_WORKFLOW: appInstance.instance.id,
                PAYMENT_DATE: payload.paymentDate,
                REASON: payload.reason,
                SOCIETY: payload.society,
                DOCUMENT: payload.document,
                MONEY: payload.money, // to string
                SUPPLIER: payload.supplier,
                SOCIEDAD_DESC: payload.sociedaddesc,
                SUPPLIER_DESC: payload.supplierdesc,
                MONEDA: payload.moneda,
                MONEDA_DESC: payload.monedadesc,
                APUNTE_CONTABLE: payload.apuntecontable,
                ANIO_CONTABLE: payload.aniocontable,
                IDIOMA: payload.idioma,
                ORDEN_COMPRA: payload.ordencompra,
                FECHA_PARTIDA: payload.fechapartida,
                FECHA_VENCIMIENTO: payload.fechavencimiento,
                FOLIO: payload.folio,
                REFERENCIA: payload.referencia,
                MANDANTE: payload.mandante,
                CENTRO_COSTO: payload.ceco,
                FECHA: appInstance.instance.startedAt,
                USUARIO: user,
                AREA_SOLICITANTE: payload.areasolicitante
            }
        )

        // Set approvers to wf instance.
        //let allTasks: ITask[] = await this.applicationInstance.getAllTask(appInstance.instance.id)

        // TODO add more info?
        return {
            id: appDbData.ID_SOLICITUD,
            suffix: appDbData.SOLICITUD_VERSION,
            paymentId: appDbData.DOCUMENT,
            stateId: HANA_APPLICATION_STATUS.APPROVEMENT_PENDING,
            wf: appInstance
        }
    }


    private formatNumberWithTwoDecimals(input: string): string {
        const number = parseFloat(input);
        const formattedNumber = number.toFixed(2);
        return formattedNumber;
    }

    private getRequestId = async (requestId: number): Promise<number> => {
        if (requestId) {
            return requestId
        } else {
            return await this.entitiesService.getNextId()
        }
    }

    private getSuffixId = async (suffixId: number, requestId: number): Promise<number> => {
        if (suffixId === undefined) {
            return 1
        } else {
            let nextId: number = await this.entitiesService.getNextSuffixId(requestId)
            console.log("nextId", nextId)
            if ((suffixId + 1) !== nextId) {
                throw new UseCaseError("El Sufijo es de una version Anterior")
            }
            return nextId
        }
    }

    // TODO validation hardcoded
    private validateMoneyRanges(money: number) {
        if (money > 100000000) {
            throw new UseCaseError('El rango debe ser menor a 100000000')
        }
    }


    //FMS se crean funciones en el backend para formatear la fecha de HANA a un formato legible dd/mm/yyyy //Inicio
    private formatDate(sapDate: any): string {
    if (!sapDate) return "N/A";
    
    // Si viene en formato "/Date(123456789)/"
    if (typeof sapDate === 'string' && sapDate.includes('/Date')) {
        const timestamp = parseInt(sapDate.replace(/\/Date\((-?\d+)\)\//, '$1'));
        const date = new Date(timestamp);
        return date.toLocaleDateString('es-MX'); // Formato dd/mm/yyyy
    }
    
    // Si ya viene como Date o String ISO, intenta formatearlo
    return new Date(sapDate).toLocaleDateString('es-MX');
}
    private getStatusDescription(statusId: number): string {
    switch (statusId) {
        case HANA_APPLICATION_STATUS.APPROVEMENT_PENDING:
            return "Pendiente";
        case HANA_APPLICATION_STATUS.REJECTED:
            return "Rechazada";
        case HANA_APPLICATION_STATUS.CANCELED:
            return "Cancelada";
        case HANA_APPLICATION_STATUS.FINISHED:
            return "Pronto pago";
        default:
            return "Estado desconocido";
    }
}
//FM FIN  considerar que estos case ya existene en el front, pero es dificil llamar funciones q aplican solo para front. 
}

export default CreateApplicationUseCase