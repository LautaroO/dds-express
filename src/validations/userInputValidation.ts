import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { ErrorResponse } from "../dto/errorResponse";
import { resolveMx } from "dns"



const resolveMxRecord = (mx: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        resolveMx(mx, (error, mxs) => {
            if (error || mxs.length === 0)
                reject(false);
            else
                resolve(true);
        });
    });
}
const validateEmailDomain = async (email: string): Promise<boolean> => {
    const splitEmail = email.split('@');
    const mx = splitEmail[1];

    return await resolveMxRecord(mx);
}

export const checkValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
        return res.status(422).json(new ErrorResponse(422, errors.array()[0].msg));

    next();
}

export const userInputValidation = body('email')
    .exists().withMessage("El parametro email es requerido")
    .bail()
    .isEmail().withMessage("El email no es valido")
    .bail()
    .custom(validateEmailDomain).withMessage("El email no tiene un dominio valido");

