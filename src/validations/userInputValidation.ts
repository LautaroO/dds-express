import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { ErrorResponse } from "../dto/errorResponse";

export const checkValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
        return res.status(422).json(new ErrorResponse(422, errors.array()[0].msg));

    next();
}

export const userInputValidation = body('email')
    .exists().withMessage("El parametro email es requerido")
    .bail()
    .isEmail().withMessage("El email no es valido");