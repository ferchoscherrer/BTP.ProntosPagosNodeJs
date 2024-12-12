export interface IArea {
    ID_AREA: number,
    DESCRIPCION: string
}

export interface IApprover {
    ID_APROBADOR: number,
    NOMBRE: string,
    MAIL: string,
    NIVEL: any,
    AREA: IArea,
    MONTO?: {
        ID_MONTO: string,
        DESCRIPCION: string,
        MONTO_MINIMO_NIVEL: number,
        MONTO_MAXIMO_NIVEL: number
    }
}


export interface IApplicationEntity {
    APROBADOR_ACTUAL: string,
    ID_ESTADO: number,
    ID_SOLICITUD: number,
    SOLICITUD_VERSION : number,
    ID_WORKFLOW: string,
    PAYMENT_DATE: Date,
    REASON: string,
    SOCIETY: string,
    DOCUMENT: string,
    MONEY: string,
    SUPPLIER: string,
    SOCIEDAD_DESC: string,
    SUPPLIER_DESC: string,
    MONEDA: string,
    MONEDA_DESC: string,
    APUNTE_CONTABLE: string,
    ANIO_CONTABLE: string,
    IDIOMA: string,
    ORDEN_COMPRA: string,
    FECHA_PARTIDA: Date,
    FECHA_VENCIMIENTO: Date,
    FOLIO: string,
    REFERENCIA: string,
    MANDANTE: string,
    CENTRO_COSTO: string,
    FECHA: Date,
    USUARIO: string,
    AREA_SOLICITANTE: string
}