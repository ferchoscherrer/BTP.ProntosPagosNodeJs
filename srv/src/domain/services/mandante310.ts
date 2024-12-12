import IMandante310 from "../../types/interfaces/IMandante310";
import IZFI from "../../types/interfaces/IZFI";
import { Mandante310Repository } from "../repositories/mandante310.repository";


class Mandante310Service {

    private mandante310Repository: IMandante310

    constructor() {
        this.mandante310Repository = new Mandante310Repository()
    }

    public async getZFI(zfi: IZFI): Promise<any> {
        console.log(">>>getZFI Service");
        return await this.mandante310Repository.getZFI(zfi)
    }

}

export default Mandante310Service