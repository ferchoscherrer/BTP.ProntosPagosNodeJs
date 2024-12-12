import { WF_INSTANCE_STATUS } from "../enums"

export interface IApplicationToCreate {
    requestId: number,
    suffix: number,
    society: string, // Zbukrs
    document: string, // Zbelnr
    ceco: string, // Zkostl
    supplier: string, // Zlifnr
    money: string, // Zwrbtr - parseFloat(oModelDatosPartidaAbierta.Zwrbtr.replace(".", "").replace(",", "."))
    filed: string, // TODO que es esto?
    paymentDate: Date, // fecha pronto pago (Zppago)
    reason: string, // texto con razon
    sociedaddesc: string, // ZbukrsDesc
    supplierdesc: string, // ZlifnrDesc
    moneda: string, // Zwaers
    monedadesc: string, // ZwaersDesc
    apuntecontable: string, // Zbuzei
    aniocontable: string, // Zgjahr
    idioma: string, // Zspras
    ordencompra: string, // Zoc
    fechapartida: Date, // Zfecha
    fechavencimiento: Date, // Zvenc
    folio: string, // Zfolio
    referencia: string, // Zref
    mandante: string, // Zmandt
    areasolicitante: string // (postalCode AD) - area
}

export interface IApplicationWfContext {
    // wf instance context data
    suffix: number,
    society: string,
    user: string,
    document: string,
    supplier: string,
    sociedadDesc: string,
    proveedorDesc: string,
    moneda: string,
    ceco: string,
    amount: number,
    filed: string,
    paymentDay: Date,
    reason: string,
    applicantID: number,
    applicantEmail: string,
    allApprovers?: any,
    referencia: string,
    areaSolicitante: string,
    operacionNivel1?: any,
    operacionNivel2?: any,
    operacionNivel3?: any,
    operacionNivel4?: any,
    approversNivel1: string,
    approversNivel2: string,
    approversNivel3: string,
    approversNivel4: string
}

export interface IApplicationWfInstance {
    // wf instance main data
    id: string,
    subject: string,
    status: WF_INSTANCE_STATUS,
    startedAt: Date,
    completedAt: Date,
}

export interface IApplicationWfData {
    // all application instance properties
    instance: IApplicationWfInstance,
    context: IApplicationWfContext
}

export interface IApplication extends IApplicationDbData {
    wf: IApplicationWfData,
}

// TODO tmb cambia, ahora en la base tenemos muchisimos datos
/*
<EntityType Name="solicitudType">
<Key>
<PropertyRef Name="ID_SOLICITUD"/>
</Key>
<Property Name="ID_SOLICITUD" Type="Edm.Int32" Nullable="false"/>
<Property Name="ID_WORKFLOW" Type="Edm.String" MaxLength="50"/>
<Property Name="ID_PAGO" Type="Edm.String" MaxLength="50"/>
<Property Name="PAYMENT_DATE" Type="Edm.DateTime"/>
<Property Name="REASON" Type="Edm.String" MaxLength="255"/>
<Property Name="SOCIETY" Type="Edm.String" MaxLength="10"/>
<Property Name="DOCUMENT" Type="Edm.String" MaxLength="20"/>
<Property Name="MONEY" Type="Edm.Decimal" Precision="13" Scale="2"/>
<Property Name="SUPPLIER" Type="Edm.String" MaxLength="10"/>
<Property Name="SOCIEDAD_DESC" Type="Edm.String" MaxLength="255"/>
<Property Name="SUPPLIER_DESC" Type="Edm.String" MaxLength="255"/>
<Property Name="MONEDA" Type="Edm.String" MaxLength="10"/>
<Property Name="MONEDA_DESC" Type="Edm.String" MaxLength="10"/>
<Property Name="APUNTE_CONTABLE" Type="Edm.String" MaxLength="10"/>
<Property Name="ANIO_CONTABLE" Type="Edm.String" MaxLength="10"/>
<Property Name="IDIOMA" Type="Edm.String" MaxLength="10"/>
<Property Name="ORDEN_COMPRA" Type="Edm.String" MaxLength="20"/>
<Property Name="FECHA_PARTIDA" Type="Edm.DateTime"/>
<Property Name="FECHA_VENCIMIENTO" Type="Edm.DateTime"/>
<Property Name="FOLIO" Type="Edm.String" MaxLength="10"/>
<Property Name="REFERENCIA" Type="Edm.String" MaxLength="255"/>
<Property Name="MANDANTE" Type="Edm.String" MaxLength="10"/>
<Property Name="CENTRO_COSTO" Type="Edm.String" MaxLength="20"/>
<Property Name="FECHA" Type="Edm.DateTime"/>
<Property Name="USUARIO" Type="Edm.String" MaxLength="255"/>
</EntityType>
*/
export interface IApplicationDbData {
    id: number,
    suffix: number,
    paymentId: string,
    stateId: number,
}