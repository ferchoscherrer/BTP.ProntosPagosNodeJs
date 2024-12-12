import ApplicationInstanceService from "../../domain/services/application";
import Mandante310Service from "../../domain/services/mandante310";
import EntitiesService from "../../domain/services/entities";
import { HANA_APPLICATION_STATUS } from "../../types/enums";
import { IApproveParams } from "../../types/interfaces/IApproveParams";
import { IContextChangeState } from "../../types/interfaces/IContextChangeState";
import ITask from "../../types/interfaces/ITask";
import IZFI from "../../types/interfaces/IZFI";
import { IApplicationEntity } from "../../types/interfaces/IEntitiesInstance";
import { IApplicationWfContext } from "../../types/interfaces/IApplicationInstance";

class ApproveApplicationLevelUseCase {

    private readonly applicationInstance: ApplicationInstanceService
    private readonly mandante310Service: Mandante310Service
    private readonly entitiesServicie: EntitiesService

    constructor() {
        this.applicationInstance = new ApplicationInstanceService()
        this.mandante310Service = new Mandante310Service()
        this.entitiesServicie = new EntitiesService()
    }

    public async approveLevel(id: string, approverParms: IApproveParams): Promise<HANA_APPLICATION_STATUS> {
        console.log(">>> ApproveApplicationLevelUseCase")

        let toState = HANA_APPLICATION_STATUS.APPROVEMENT_PENDING
        //Aprobar
        let getAllTask: ITask[] = await this.applicationInstance.getAllTask(id);
        console.log(getAllTask)

        let currentTask: ITask = this.getLastTask(getAllTask)
        console.log(currentTask)

        const currentLevel: number = Number(currentTask.attributes[0].value)

        let contextApprove: IContextChangeState =
        {
            [`operacionNivel${currentLevel}`]: {
                "nombreResponsable": approverParms.approverName,
                "mailResponsable": approverParms.approverMail,
                "fechaOperacion": (new Date()).toISOString().split('T')[0],
                "observaciones": approverParms.reason,
                "accion": "A"
            }
        }
        console.log('context approve: ', contextApprove)

        // TODO catch error and make service notificate it
        if (currentLevel === 4) {

            const today = new Date()
            toState = HANA_APPLICATION_STATUS.FINISHED

            // gets data in hana
            const data: IApplicationEntity = await this.entitiesServicie.getAllData(id)
            const wfInstanceId = data.ID_SOLICITUD
            const suffix = data.SOLICITUD_VERSION
            /*
            let zfi: IZFI = {
                Zmandt: '310', //mandante
                Zspras: 'ES', //IDIOMA
                Zbukrs: '1000', //Sociedad - "society"
                Zbelnr: '0200000895', //Numero Documento Contable - "document"
                Zgjahr: '2009', //Ejercicio (año contable)
                Zbuzei: '001', //Numero de apunte Contable dentro del documento contable
                Zppago: '20240404', //Fecha de pronto pago - "PaymentDate"
                Zfolio: '0001', // llega vacio, ver con migue que es
                Zref: '', // referencia
                Zoc: '' // orden compra
            }
            */
            let zfi: IZFI = {
                Zmandt: data.MANDANTE, //mandante
                Zspras: data.IDIOMA, //IDIOMA
                Zbukrs: data.SOCIETY, //Sociedad - "society"
                Zbelnr: data.DOCUMENT, //Numero Documento Contable - "document"
                Zgjahr: data.ANIO_CONTABLE, //Ejercicio (año contable)
                Zbuzei: data.APUNTE_CONTABLE, //Numero de apunte Contable dentro del documento contable
                Zppago: this.formatDate(String(data.PAYMENT_DATE)), // Fecha de pronto pago - "PaymentDate" // TODO formatear o migue lo toma asi?
                Zfolio: String(data.ID_SOLICITUD), // TODO llega vacio, ver con migue que es
                Zref: data.REFERENCIA, // referencia
                Zoc: data.ORDEN_COMPRA // orden compra
            }

            // calls document service (BAPI)
            await this.mandante310Service.getZFI(zfi)

            // update state
            await this.entitiesServicie.setStateApplicationRelation(wfInstanceId, suffix, toState)
        }
        else {
            let currentContext: IApplicationWfContext = (await this.applicationInstance.getApplicationContext(id))
            console.log('currentContext', currentContext)

            let nextLevel: number = currentLevel + 1
            console.log('nextLevel', nextLevel)

            let nextApprover: string = currentContext[`approversNivel${nextLevel}`]
            console.log('nextApprover', nextApprover)

            let mails: string = nextApprover.replace(',', '|,|')
            console.log('mails', mails)

            await this.entitiesServicie.changeCurrentApprover('|' + mails + '|', currentContext.applicantID, currentContext.suffix)
        }

        await this.applicationInstance.approveLevel(currentTask.id, contextApprove)
        console.log('Aprobado!')

        return toState

    }

    private getLastTask(tasks: ITask[]): ITask {
        return tasks.reduce((prevTask, currentTask) => {
            return (prevTask.createdAt > currentTask.createdAt) ? prevTask : currentTask
        }, tasks[0])
    }
    private formatDate = (dateString: string): string => {
        const milliseconds = parseInt(dateString.match(/\d+/)[0]);

        const date = new Date(milliseconds);

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        return `${year}${month}${day}`;
    };



}

export default ApproveApplicationLevelUseCase