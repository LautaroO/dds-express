import { Router, Request, Response } from "express";
import { validationResult } from "express-validator";
import { AppDataSource } from "../data-source";
import { Distance } from "../dto/distance";
import { ErrorResponse } from "../dto/errorResponse";
import { UserCreated } from "../dto/userCreated";
import { UserInput } from "../dto/userInput";
import { Localidad } from "../entity/Localidad";
import { Municipio } from "../entity/Municipio";
import { Pais } from "../entity/Pais";
import { Provincia } from "../entity/Provincia";
import { User } from "../entity/User";
import { ApiRequest } from "../middleware/apiRequest";
import AuthHandler from "../middleware/authHandler";
import PaginationHandler from "../middleware/paginationHandler";
import RequestHandler from "../middleware/requestHandler";
import { skip, generateToken, getRandomNumber, maxOffsetSize } from "../helpers/helpers";
import { checkValidationErrors, userInputValidation } from "../validations/userInputValidation";

export const routes = Router();

routes.get('/paises', AuthHandler.authenticate, PaginationHandler.getPagination, async (req: ApiRequest, res: Response) => {
    const repo = AppDataSource.getRepository(Pais);

    const paises: Pais[] = await repo.find({ take: maxOffsetSize, skip: skip(req.offset!) });
    console.log(paises, req.offset, maxOffsetSize);
    return res.json(paises);
});

routes.get('/provincias', AuthHandler.authenticate, PaginationHandler.getPagination, async (req: ApiRequest, res: Response) => {
    const repo = AppDataSource.getRepository(Provincia);

    const paisId = req.query.paisId as string | undefined;

    const provincias: Provincia[] = await repo.find({ relations: ['pais'], take: maxOffsetSize, skip: skip(req.offset!), where: { pais: { id: paisId } } });
    return res.json(provincias);
});

routes.get('/municipios', AuthHandler.authenticate, PaginationHandler.getPagination, async (req: ApiRequest, res: Response) => {
    const repo = AppDataSource.getRepository(Municipio);

    const provinciaId = req.query.provinciaId as string | undefined;

    const municipios: Municipio[] = await repo.find({ relations: ['provincia'], take: maxOffsetSize, skip: skip(req.offset!), where: { provincia: { id: provinciaId } } });
    return res.json(municipios);
});

routes.get('/localidades', AuthHandler.authenticate, PaginationHandler.getPagination, async (req: ApiRequest, res: Response) => {
    const repo = AppDataSource.getRepository(Localidad);

    const municipioId = req.query.municipioId as string | undefined;

    const localidades: Localidad[] = await repo.find({ relations: ['municipio'], take: maxOffsetSize, skip: skip(req.offset!), where: { municipio: { id: municipioId } } });
    return res.json(localidades);
});

//refactor con express-validator? :p
routes.get('/distancia', AuthHandler.authenticate, async (req: Request, res: Response) => {
    //Query params
    const localidadOrigenId = req.query.localidadOrigenId as string | undefined;
    if (!localidadOrigenId)
        return res.status(400).json(new ErrorResponse(400, "El parametro localidadOrigenId es obligatorio"));

    const calleOrigen = req.query.calleOrigen;
    if (!calleOrigen)
        return res.status(400).json(new ErrorResponse(400, "El parametro calleOrigen es obligatorio"));

    const alturaOrigen = req.query.alturaOrigen;
    if (!alturaOrigen)
        return res.status(400).json(new ErrorResponse(400, "El parametro alturaOrigen es obligatorio"));

    const localidadDestinoId = req.query.localidadDestinoId as string;
    if (!localidadDestinoId)
        return res.status(400).json(new ErrorResponse(400, "El parametro localidadDestinoId es obligatorio"));

    const calleDestino = req.query.calleDestino;
    if (!calleDestino)
        return res.status(400).json(new ErrorResponse(400, "El parametro calleDestino es obligatorio"));

    const alturaDestino = req.query.alturaDestino;
    if (!alturaDestino)
        return res.status(400).json(new ErrorResponse(400, "El parametro alturaDestino es obligatorio"));

    const repo = AppDataSource.getRepository(Localidad);

    const localidadOrigen = await repo.findOneBy({ id: localidadOrigenId });
    const localidadDestino = await repo.findOneBy({ id: localidadDestinoId });

    if (!localidadOrigen)
        return res.status(422).json(new ErrorResponse(422, "No existe la localidad con id " + localidadOrigenId));

    if (!localidadDestino)
        return res.status(422).json(new ErrorResponse(422, "No existe la localidad con id " + localidadDestinoId));

    const randomDistance = getRandomNumber(1, 50);

    return res.json(new Distance(randomDistance.toFixed(3), "KM"));
});


routes.post('/user', RequestHandler.checkContentType, userInputValidation, checkValidationErrors,
    async (req: Request, res: Response) => {

        const userInput: UserInput = req.body;

        const userRepo = AppDataSource.getRepository(User);
        const existantUser: User | null = await userRepo.findOneBy({ email: userInput.email });

        if (existantUser)
            return res.status(409).json(new ErrorResponse(409, "El email ya se encuentra registrado"));

        const user: User = new User();
        user.email = userInput.email;
        user.generatedId = Math.floor(getRandomNumber(1000, 1000000));
        user.token = generateToken(user);

        await userRepo.insert(user);

        return res.status(201).json(new UserCreated(user.email, user.token))
    });