import { NextFunction, Response } from "express";
import { ErrorResponse } from "../dto/errorResponse";
import { ApiRequest } from "./apiRequest";

class PaginationHandler {

    getPagination(req: ApiRequest, res: Response, next: NextFunction) {

        const offset = Number(req.query.offset)

        if (isNaN(offset) || offset <= 0)
            return res.status(400).json(new ErrorResponse(400, "El parametro offset es un numero requerido y mayor a 1"));

        req.offset = offset;

        next();
    }
}

export default new PaginationHandler();