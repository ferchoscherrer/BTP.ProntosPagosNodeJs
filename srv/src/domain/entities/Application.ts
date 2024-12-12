class Application {

    private readonly ID: string;
    private suffix: string;
    private readonly society: string;
    private readonly user: string;
    private readonly username: string;
    private readonly document: string;
    private readonly supplier: string;
    private readonly ceco: string;
    private readonly money: string;
    private readonly filed: string;
    private readonly paymentDate: Date;
    private readonly reason: string;
    private readonly sociedaddesc: string;
    private readonly supplierdesc: string;
    private readonly moneda: string;
    private readonly monedadesc: string;
    private readonly apuntecontable: string;
    private readonly aniocontable: string;
    private readonly idioma: string;
    private readonly ordencompra: string;
    private readonly fechapartida: Date;
    private readonly fechavencimiento: Date;
    private readonly folio: string;
    private readonly referencia: string;
    private readonly mandante: string;
    private readonly areasolicitante: string;

    constructor(
        ID: string,
        suffix: string,
        society: string,
        user: string,
        username: string,
        document: string,
        supplier: string,
        ceco: string,
        money: string,
        filed: string,
        paymentDate: Date,
        reason: string,
        sociedaddesc: string,
        supplierdesc: string,
        moneda: string,
        monedadesc: string,
        apuntecontable: string,
        aniocontable: string,
        idioma: string,
        ordencompra: string,
        fechapartida: Date,
        fechavencimiento: Date,
        folio: string,
        referencia: string,
        mandante: string,
        areasolicitante: string
    ) {
        this.ID = ID
        this.suffix = suffix
        this.society = society
        this.user = user
        this.username = username
        this.document = document
        this.supplier = supplier
        this.ceco = ceco
        this.money = money
        this.filed = filed
        this.paymentDate = paymentDate
        this.reason = reason
        this.sociedaddesc = sociedaddesc
        this.supplierdesc = supplierdesc
        this.moneda = moneda
        this.monedadesc = monedadesc
        this.apuntecontable = apuntecontable
        this.aniocontable = aniocontable
        this.idioma = idioma
        this.ordencompra = ordencompra
        this.fechapartida = fechapartida
        this.fechavencimiento = fechavencimiento
        this.folio = folio
        this.referencia = referencia
        this.mandante = mandante
        this.areasolicitante = areasolicitante
    }

    // TODO check dates
    public static convertFromPayload(payload: any, user: string, username: string) {
        return new Application(
            payload.ID,
            payload.suffix,
            payload.society,
            user,
            username,
            payload.document,
            payload.supplier,
            payload.ceco,
            payload.money,
            payload.filed,
            new Date(payload.paymentDate),
            payload.reason,
            payload.sociedaddesc,
            payload.supplierdesc,
            payload.moneda,
            payload.monedadesc,
            payload.apuntecontable,
            payload.aniocontable,
            payload.idioma,
            payload.ordencompra,
            payload.fechapartida,
            payload.fechavencimiento,
            payload.folio,
            payload.referencia,
            payload.mandante,
            payload.areasolicitante
        )
    }

    public getID(): string {
        return this.ID;
    }

    public getSuffix(): string {
        return this.suffix;
    }

    public setSuffix(suffix: string): void {
        this.suffix = suffix;
    }

    public getSociety(): string {
        return this.society;
    }

    public getUser(): string {
        return this.user;
    }

    public getDocument(): string {
        return this.document;
    }

    public getCeco(): string {
        return this.ceco;
    }

    public getSupplier(): string {
        return this.supplier;
    }

    public getMoney(): string {
        return this.money;
    }

    public getFiled(): string {
        return this.filed;
    }

    public getPaymentDate(): Date {
        return this.paymentDate;
    }

    public getReason(): string {
        return this.reason;
    }

    public getSocietyDesc(): string {
        return this.sociedaddesc;
    }

    public getSupplierDesc(): string {
        return this.supplierdesc;
    }

    public getMoneda(): string {
        return this.moneda;
    }

    getUserName() {
        return this.username
    }

    public getAreaSolicitante(): string {
        return this.areasolicitante;
    }

    public getReferencia(): string {
        return this.referencia;
    }
}

export default Application