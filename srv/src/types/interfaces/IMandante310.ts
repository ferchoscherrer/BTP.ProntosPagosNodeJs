import IZFI from "./IZFI";

export default interface IMandante310 {
    getZFI(zfi: IZFI): Promise<any>
}