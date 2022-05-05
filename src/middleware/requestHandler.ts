import { NextFunction, Response, Request } from "express";
import { ErrorResponse } from "../dto/errorResponse";

class RequestHandler {

    checkContentType(req: Request, res: Response, next: NextFunction) {
        let contype = req.is('application/json');
        if (!contype)
            return res.status(400).json(new ErrorResponse(400, "El contenido del body debe tener formato json"));
        next();
    }
}

export default new RequestHandler();