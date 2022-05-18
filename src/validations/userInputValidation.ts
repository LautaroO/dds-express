import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { ErrorResponse } from "../dto/errorResponse";
import validate from "deep-email-validator";
import { OutputFormat } from "deep-email-validator/dist/output/output";

const validateEmailDomain = async (email: string): Promise<boolean> => {
    const validation: OutputFormat = await validate({
        email: email,
        validateRegex: false,
        validateMx: true,
        validateTypo: false,
        validateDisposable: true,
        validateSMTP: true,
    })

    if (!validation.valid)
        return Promise.reject(false);

    return Promise.resolve(true);
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

