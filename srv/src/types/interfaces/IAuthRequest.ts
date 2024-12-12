import { Request } from "express";

export default interface IAuthRequest extends Request {
    user: any,
    name: {
        givenName: string,
        familyName: string
    }
}