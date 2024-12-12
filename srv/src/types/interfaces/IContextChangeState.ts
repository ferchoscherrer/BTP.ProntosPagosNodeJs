export interface IContextChangeState {

    [operacionNivel: string]: {
        nombreResponsable: string,
        mailResponsable: string,
        fechaOperacion: string,
        observaciones: string,
        accion: string
    }

}