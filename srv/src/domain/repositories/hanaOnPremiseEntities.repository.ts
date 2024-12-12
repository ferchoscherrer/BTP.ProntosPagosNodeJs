import { IApplicationDbData } from "../../types/interfaces/IApplicationInstance";
import { IApplicationEntity, IApprover, IArea } from "../../types/interfaces/IEntitiesInstance";
import IEntitiesRepository from "../../types/interfaces/IEntitiesRepository";
import SapAxios from "../../utils/sapAxios";

class HanaEntitiesRepository implements IEntitiesRepository {

    private destination: string = "srvhadPP"
    private approversPathPrefix: string = "aprobador.xsodata"
    private applicationPathPrefix: string = "solicitud.xsodata"

    private axios: SapAxios

    constructor() {
        this.axios = new SapAxios(this.destination)
    }

    public async getAreaByDesc(description: string): Promise<IArea> {
        console.log(">>> HanaEntitiesRepository - getAreaByDesc: " + description);
        try {
            const res = await this.axios.get(`${this.approversPathPrefix}/area`, {
                $filter: `DESCRIPCION eq '${description}'`
            })
            console.log("Response: ", res.data);
            const data = res.data?.d?.results[0]
            if (!data) {
                return null;  // Devuelve null si no se encuentra el área
            }
            return {
                ID_AREA: data.ID_AREA,
                DESCRIPCION: data.DESCRIPCION
            }
        } catch (err) {
            throw err
        }
    }

    public async getApprovers(filters?: any): Promise<IApprover[]> {
        console.log(">>> HanaEntitiesRepository - getApprovers");
        try {
            const filtersQuery = []
            const params = { $expand: "aa,an,am" }

            if (filters?.ID_AREA) filtersQuery.push(`ID_AREA eq ${filters.ID_AREA}`);
            if (filters?.ID_NIVEL) filtersQuery.push(`ID_NIVEL eq ${filters.ID_NIVEL}`);

            params["$filter"] = filtersQuery.join(" and ")

            const res = await this.axios.get(`${this.approversPathPrefix}/aprobador`, params)
            console.log("Response: ", res.data?.d?.results);

            const data = res.data?.d?.results
            return data.map((approver: any) => (
                {
                    ID_APROBADOR: approver?.ID_APROBADOR,
                    NOMBRE: approver?.NOMBRE,
                    MAIL: approver?.MAIL,
                    AREA: {
                        ID_AREA: approver?.aa?.ID_AREA,
                        DESCRIPCION: approver?.aa?.DESCRIPCION,
                    },
                    MONTO: {
                        ID_MONTO: approver?.am?.ID_MONTO,
                        DESCRIPCION: approver?.am?.DESCRIPCION,
                        MONTO_MINIMO_NIVEL: approver?.am?.MONTO_MINIMO_NIVEL,
                        MONTO_MAXIMO_NIVEL: approver?.am?.MONTO_MAXIMO_NIVEL
                    },
                    NIVEL: approver?.ID_NIVEL
                })
            )
        } catch (err) {
            throw err
        }
    }

    public async getApplications(): Promise<any> {
        console.log(">>> HanaEntitiesRepository - getApplications");
        try {
            const res = await this.axios.get(`${this.applicationPathPrefix}/solicitud`)
            console.log("Response: ", res.data?.d?.results?.length);
            return res.data?.d?.results
        }
        catch (err) {
            throw err
        }
    }

    public async createApplication(body: IApplicationEntity): Promise<any> {
        console.log(">>> HanaEntitiesRepository - createApplication");
        try {

            // From: YYYY-MM-DDT00:00:00.000Z ... To Unix: "/Date(1500854400000)/" 
            const startedAtUnixFormat = "/Date(" + (new Date(body.FECHA)).valueOf() + ")/"
            console.log(`STARTED_AT ... converting date: ${(new Date(body.FECHA))} to unix: ${(new Date(body.FECHA)).valueOf()}`)

            const paymentDateUnixFormat = "/Date(" + (new Date(body.PAYMENT_DATE)).valueOf() + ")/"
            console.log(`PAYMENT_DATE ... converting date: ${(new Date(body.PAYMENT_DATE))} to unix: ${(new Date(body.PAYMENT_DATE)).valueOf()}`)

            const zFechaUnixFormat = "/Date(" + (new Date(body.FECHA_PARTIDA)).valueOf() + ")/"
            console.log(`FECHA_PARTIDA ... converting date: ${(new Date(body.FECHA_PARTIDA))} to unix: ${(new Date(body.FECHA_PARTIDA)).valueOf()}`)

            const zVencUnixFormat = "/Date(" + (new Date(body.FECHA_VENCIMIENTO)).valueOf() + ")/"
            console.log(`FECHA_VENCIMIENTO ... converting date: ${(new Date(body.FECHA_VENCIMIENTO))} to unix: ${(new Date(body.FECHA_VENCIMIENTO)).valueOf()}`)

            const res = await this.axios.post(`${this.applicationPathPrefix}/solicitud`, {
                ID_ESTADO: body.ID_ESTADO,
                ID_SOLICITUD: body.ID_SOLICITUD,
                SOLICITUD_VERSION: body.SOLICITUD_VERSION,
                ID_WORKFLOW: body.ID_WORKFLOW,
                PAYMENT_DATE: paymentDateUnixFormat, // body.PAYMENT_DATE,
                REASON: body.REASON,
                SOCIETY: body.SOCIETY,
                DOCUMENT: body.DOCUMENT,
                MONEY: body.MONEY,
                // MONEY: Number(body.MONEY),
                SUPPLIER: body.SUPPLIER,
                SOCIEDAD_DESC: body.SOCIEDAD_DESC,
                SUPPLIER_DESC: body.SUPPLIER_DESC,
                MONEDA: body.MONEDA,
                MONEDA_DESC: body.MONEDA_DESC,
                APUNTE_CONTABLE: body.APUNTE_CONTABLE,
                ANIO_CONTABLE: body.ANIO_CONTABLE,
                IDIOMA: body.IDIOMA,
                ORDEN_COMPRA: body.ORDEN_COMPRA,
                FECHA_PARTIDA: zFechaUnixFormat, // body.FECHA_PARTIDA,
                FECHA_VENCIMIENTO: zVencUnixFormat, //body.FECHA_VENCIMIENTO,
                FOLIO: body.FOLIO,
                REFERENCIA: body.REFERENCIA,
                MANDANTE: body.MANDANTE,
                CENTRO_COSTO: body.CENTRO_COSTO,
                APROBADOR_ACTUAL: body.APROBADOR_ACTUAL,
                USUARIO: body.USUARIO,
                FECHA: startedAtUnixFormat,
                AREA_SOLICITANTE: body.AREA_SOLICITANTE
            })
            console.log("Response: ", res.data);

            // TODO check response
            return {
                ID_ESTADO: res.data.d.ID_ESTADO,
                ID_SOLICITUD: res.data.d.ID_SOLICITUD,
                ID_WORKFLOW: res.data.d.ID_WORKFLOW,
                PAYMENT_DATE: res.data.d.PAYMENT_DATE,
                REASON: res.data.d.REASON,
                SOCIETY: res.data.d.SOCIETY,
                DOCUMENT: res.data.d.DOCUMENT,
                MONEY: res.data.d.MONEY,
                SUPPLIER: res.data.d.SUPPLIER,
                SOCIEDAD_DESC: res.data.d.SOCIEDAD_DESC,
                SUPPLIER_DESC: res.data.d.SUPPLIER_DESC,
                MONEDA: res.data.d.MONEDA,
                MONEDA_DESC: res.data.d.MONEDA_DESC,
                APUNTE_CONTABLE: res.data.d.APUNTE_CONTABLE,
                ANIO_CONTABLE: res.data.d.ANIO_CONTABLE,
                IDIOMA: res.data.d.IDIOMA,
                ORDEN_COMPRA: res.data.d.ORDEN_COMPRA,
                FECHA_PARTIDA: res.data.d.FECHA_PARTIDA,
                FECHA_VENCIMIENTO: res.data.d.FECHA_VENCIMIENTO,
                FOLIO: res.data.d.FOLIO,
                REFERENCIA: res.data.d.REFERENCIA,
                MANDANTE: res.data.d.MANDANTE,
                CENTRO_COSTO: res.data.d.CENTRO_COSTO,
                APROBADOR_ACTUAL: res.data.d.APROBADOR_ACTUAL,
                USUARIO: res.data.d.USUARIO,
                FECHA: res.data.d.FECHA,
                AREA_SOLICITANTE: res.data.d.AREA_SOLICITANTE
            }
        }
        catch (err) {
            throw err
        }
    }

    public async changeStateApplication(idRequest: number, suffixId: number, stateId: number): Promise<any> {
        console.log(">>> HanaEntitiesRepository - changeStateApplication");
        try {
            const res = await this.axios.patch(`${this.applicationPathPrefix}/solicitud(ID_SOLICITUD=${idRequest},SOLICITUD_VERSION=${suffixId})`, {
                ID_ESTADO: stateId
            });
            console.log("Response: ", res.data);
        }
        catch (err) {
            console.log(err.response.data.error);
            throw err;
        }
    }

    public async changeCurrentApprover(mailApprover: string, requestId: number, suffix: number): Promise<any> {
        console.log(">>> HanaEntitiesRepository - changeStateApplication");
        try {//to change
            const res = await this.axios.patch(`${this.applicationPathPrefix}/solicitud(ID_SOLICITUD=${requestId},SOLICITUD_VERSION=${suffix})`, {
                APROBADOR_ACTUAL: mailApprover
            })
            console.log("Response: ", res.data);
        }
        catch (err) {
            console.log(err.response.data.error)
            throw err
        }
    }

    public async changeLauncherstatus(requestId: number, suffix: number, launchID: number,): Promise<any> {
        console.log(">>> HanaEntitiesRepository - changeLauncherstatus");
        try {
            const url = `${this.applicationPathPrefix}/solicitud(ID_SOLICITUD=${requestId},SOLICITUD_VERSION=${suffix})`;
            const res = await this.axios.patch(url, {
                RELANZADO : launchID
            });
            console.log("Response: ", res.data);
        }
        catch (err) {
            console.log(err.response.data.error);
            throw err;
        }
    }

    public async getLauncherId(requestId: number, suffixId: number): Promise<any> {
        console.log(">>> HanaEntitiesRepository - getLauncherId");
        try {
            const res = await this.axios.get(`${this.applicationPathPrefix}/solicitud`, {
                $filter: `ID_SOLICITUD eq ${requestId} and SOLICITUD_VERSION eq ${suffixId}`
            })
            console.log("Response: ", res.data?.d);
            const stateApplicationEntries: any[] = res.data?.d?.results
            const currentStateApplicationEntry = stateApplicationEntries.reverse()[0]
            return currentStateApplicationEntry?.RELANZADO
        } catch (err) {
            throw err
        }
    }


    public async getApplicationData(workflowId: string): Promise<IApplicationDbData> {
        console.log(">>> HanaEntitiesRepository - getApplicationData");
        try {
            const res = await this.axios.get(`${this.applicationPathPrefix}/solicitud`, {
                $filter: `ID_WORKFLOW eq '${workflowId}'`
            })
            console.log("Response: ", res.data?.d);
            const stateApplicationEntries: any[] = res.data?.d?.results
            const currentStateApplicationEntry = stateApplicationEntries.reverse()[0]
            return {
                id: currentStateApplicationEntry?.ID_SOLICITUD,
                suffix: currentStateApplicationEntry?.SOLICITUD_VERSION,
                paymentId: currentStateApplicationEntry?.DOCUMENT,
                stateId: currentStateApplicationEntry?.ID_ESTADO,
            }
        }
        catch (err) {
            throw err
        }
    }

    public async getRequestStatusId(requestId: number, suffix: number): Promise<any> {
        console.log(">>> HanaEntitiesRepository - getApplicationData");
        try {
            const res = await this.axios.get(`${this.applicationPathPrefix}/solicitud(ID_SOLICITUD=${requestId},SOLICITUD_VERSION=${suffix})`)
            console.log("Response: ", res.data?.d);
            return res.data?.d.ID_ESTADO
        }
        catch (err) {
            throw err
        }
    }

    public async getAllData(workflowId: string): Promise<IApplicationEntity> {
        console.log(">>> HanaEntitiesRepository - getApplicationData");
        try {
            const res = await this.axios.get(`${this.applicationPathPrefix}/solicitud`, {
                $filter: `ID_WORKFLOW eq '${workflowId}'`
            })
            console.log("Response: ", res.data?.d);
            const stateApplicationEntries: any[] = res.data?.d?.results
            const currentStateApplicationEntry = stateApplicationEntries.reverse()[0]
            return {
                APROBADOR_ACTUAL: currentStateApplicationEntry?.APROBADOR_ACTUAL,
                ID_ESTADO: currentStateApplicationEntry?.ID_ESTADO,
                ID_SOLICITUD: currentStateApplicationEntry?.ID_SOLICITUD,
                SOLICITUD_VERSION: currentStateApplicationEntry?.SOLICITUD_VERSION,
                ID_WORKFLOW: currentStateApplicationEntry?.ID_WORKFLOW,
                PAYMENT_DATE: currentStateApplicationEntry?.PAYMENT_DATE,
                REASON: currentStateApplicationEntry?.REASON,
                SOCIETY: currentStateApplicationEntry?.SOCIETY,
                DOCUMENT: currentStateApplicationEntry?.DOCUMENT,
                MONEY: currentStateApplicationEntry?.MONEY,
                SUPPLIER: currentStateApplicationEntry?.SUPPLIER,
                SOCIEDAD_DESC: currentStateApplicationEntry?.SOCIEDAD_DESC,
                SUPPLIER_DESC: currentStateApplicationEntry?.SUPPLIER_DESC,
                MONEDA: currentStateApplicationEntry?.MONEDA,
                MONEDA_DESC: currentStateApplicationEntry?.MONEDA_DESC,
                APUNTE_CONTABLE: currentStateApplicationEntry?.APUNTE_CONTABLE,
                ANIO_CONTABLE: currentStateApplicationEntry?.ANIO_CONTABLE,
                IDIOMA: currentStateApplicationEntry?.IDIOMA,
                ORDEN_COMPRA: currentStateApplicationEntry?.ORDEN_COMPRA,
                FECHA_PARTIDA: currentStateApplicationEntry?.FECHA_PARTIDA,
                FECHA_VENCIMIENTO: currentStateApplicationEntry?.FECHA_VENCIMIENTO,
                FOLIO: currentStateApplicationEntry?.FOLIO,
                REFERENCIA: currentStateApplicationEntry?.REFERENCIA,
                MANDANTE: currentStateApplicationEntry?.MANDANTE,
                CENTRO_COSTO: currentStateApplicationEntry?.CENTRO_COSTO,
                USUARIO: currentStateApplicationEntry?.USUARIO,
                FECHA: currentStateApplicationEntry?.FECHA,
                AREA_SOLICITANTE: currentStateApplicationEntry?.AREA_SOLICITANTE
            }
        }
        catch (err) {
            throw err
        }
    }

    public async getNextId(): Promise<number> {
        console.log(">>> HanaEntitiesRepository - getNextId");
        try {
            const res = await this.axios.get(`get_max_id.xsjs`)
            console.log("Response: ", res.data);
            return Number(res.data.id_solicitud)
        }
        catch (err) {
            throw err
        }
    }

    public async getNextSuffixId(requestId: number): Promise<number> {
        console.log(">>> HanaEntitiesRepository - getNextSuffixId");
        try {
            const params = {
                solicitud: requestId,
            }
            const res = await this.axios.get(`get_max_version_by_id.xsjs`, params)
            console.log("Response: ", res.data);
            return Number(res.data.solicitud_version)
        }
        catch (err) {
            throw err
        }
    }
}

export default HanaEntitiesRepository