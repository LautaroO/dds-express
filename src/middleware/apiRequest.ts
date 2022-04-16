import { User } from "../entity/User";
import { Request } from "express";

export interface ApiRequest extends Request {
    offset?: number;
    user?: User;
}