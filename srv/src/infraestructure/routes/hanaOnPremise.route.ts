import express, { Response } from "express"
import IAuthRequest from "../../types/interfaces/IAuthRequest";
import SapAxios from "../../utils/sapAxios";

// TODO: Quitar. Leer abajo.
/**
 * Sólo con propósitos de prueba, para realizar llamados al servicio on-premise
 * y visualizar los datos que el mismo devuelva.
 */

const hanaOnPremiseRouter = express.Router()

hanaOnPremiseRouter.post("/", async (req: IAuthRequest, res: Response) => {
    try {
        const entity = req.body.entity
        const data = req.body.data
        const axios = new SapAxios("srvhadPP")
        const response = await axios.post(`/${entity}`, data)
        console.log("Response: ", response.data?.d);
        
        res.status(200).send(response.data?.d)
    } 
    catch (error) {
        console.error(error)    
        res.status(500).send("Internal server error")
    }
});

hanaOnPremiseRouter.put("/", async (req: IAuthRequest, res: Response) => {
    try {
        const entity = req.body.entity
        const axios = new SapAxios("srvhadPP")
        const response = await axios.get(`/${entity}`)
        console.log("Response: ", response.data?.d);
        res.status(200).send(response.data?.d)
    } 
    catch (error) {
        console.error(error)    
        res.status(500).send("Internal server error")
    }
});

hanaOnPremiseRouter.put("/metadata", async (req: IAuthRequest, res: Response) => {
    try {
        const entity = req.body.entity
        const axios = new SapAxios("srvhadPP")
        const response = await axios.get(`/${entity}`)
        console.log("Response: ", response.data);
        res.status(200).send(response.data)
    } 
    catch (error) {
        console.error(error)    
        res.status(500).send("Internal server error")
    }
});

export default hanaOnPremiseRouter