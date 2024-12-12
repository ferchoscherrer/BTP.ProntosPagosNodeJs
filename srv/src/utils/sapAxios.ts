import SapCfAxios, { AxiosInstance } from 'sap-cf-axios';

class SapAxios {
    
    private readonly axios: AxiosInstance;

    constructor(destination: string) {
        this.axios = SapCfAxios(destination)
    }

    public async get(path: string, params = {}, headers = { "Content-Type": "application/json" }) {
        return await this.axios({
            method: "GET",
            url: path,
            headers,
            params
        })
    }

    public async post(path: string, data: any, headers = { "Content-Type": "application/json" }) {
        return await this.axios({
            method: "POST",
            url: path,
            headers,
            data
        })
    }

    public async patch(path: string, data: any, params = {}, headers = { "Content-Type": "application/json" }) {
        return await this.axios({
            method: "PATCH",
            url: path,
            headers,
            params,
            data
        })
    }
}

export default SapAxios