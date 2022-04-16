import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ErrorResponse } from "../dto/errorResponse";
import { User } from "../entity/User";

class AuthenticationHandler {

    async authenticate(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;

        if (!authHeader)
            return res.status(403).json(new ErrorResponse(403, "Missing authorization header."));

        const [schema, ...rest] = authHeader.split(" ");

        if (schema !== "Bearer")
            return res.status(403).json(new ErrorResponse(403, "Authorization schema must be Bearer."));

        const token = rest.join('').trim();

        if (!token)
            return res.status(403).json(new ErrorResponse(403, "A token must be provided."));

        const repo = AppDataSource.getRepository(User);

        const user = await repo.findOneBy({ token: token });

        // if (!user)
        //     return res.status(403).json(new ErrorResponse(403, "Invalid Token."))

        //req.user = user;

        next();
    }
}

export default new AuthenticationHandler();