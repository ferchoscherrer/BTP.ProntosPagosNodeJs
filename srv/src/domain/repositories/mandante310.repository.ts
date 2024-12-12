import IMandante310 from "../../types/interfaces/IMandante310";
import IZFI from "../../types/interfaces/IZFI";

const SapCfAxios = require('sap-cf-axios').default;


export class Mandante310Repository implements IMandante310 {

    // TODO use user provided variable for destination
    private readonly destination: string = process.env.DESTINATION_310_ID;
    // TODO get sap-client from destination
    private readonly axios = SapCfAxios(this.destination, { headers: { "Content-Type": "application/json", "sap-client": process.env.SAP_CLIENT } })

    constructor() { }

    public async getZFI(zfi: IZFI): Promise<void> {
        console.log(">>> WorkflowRepository - getApplicationInstances");
        try {
            //let axiosInstance = SapCfAxios(this.destination)

            let path = `/ZFI_PRONTO_PAGO_SRV/UpdDocSet?$filter=( Zbukrs eq '${zfi.Zbukrs}' and Zbelnr eq '${zfi.Zbelnr}' and Zbuzei eq '${zfi.Zbuzei}' and Zgjahr eq '${zfi.Zgjahr}' and Zppago eq '${zfi.Zppago}' and Zref eq '${zfi.Zref}' and Zoc eq '${zfi.Zoc}' and Zfolio eq '${zfi.Zfolio}' ) `
            //let headers = { "Content-Type": "application/json", "sap-client": '310' };
            console.log("path: ", path)
            
            let data = await this.axios({
                method: 'GET',
                url: `${path}`
                //xsrfHeaderName: 'x-csrf-token'
                //headers: headers
            })
            console.log('response: ', data.response)
        }
        catch (error) {
            console.log('erroror log: ', error.response.data)
            throw error
        }
    }
}