import { Router, Request, Response, response } from "express";
import { serve, setup } from "swagger-ui-express";
import { AppDataSource } from "../data-source";
import { Address } from "../dto/address";
import { Distance } from "../dto/distance";
import { ErrorResponse } from "../dto/errorResponse";
import { Localidad } from "../entity/Localidad";
import { Municipio } from "../entity/Municipio";
import { Pais } from "../entity/Pais";
import { Provincia } from "../entity/Provincia";
import { ApiRequest } from "../middleware/apiRequest";
import AuthHandler from "../middleware/authHandler";
import PaginationHandler from "../middleware/paginationHandler";

export const routes = Router();

const maxSize = 50;

routes.get('/paises', AuthHandler.authenticate, PaginationHandler.getPagination, async (req: ApiRequest, res: Response) => {
    const repo = AppDataSource.getRepository(Pais);

    const paises: Pais[] = await repo.find({ take: maxSize, skip: skip(req.offset!) });
    return res.json(paises);
});

routes.get('/provincias', AuthHandler.authenticate, PaginationHandler.getPagination, async (req: ApiRequest, res: Response) => {
    const repo = AppDataSource.getRepository(Provincia);

    const paisId = req.query.paisId as string | undefined;

    const provincias: Provincia[] = await repo.find({ relations: ['pais'], take: maxSize, skip: skip(req.offset!), where: { pais: { id: paisId } } });
    return res.json(provincias);
});

routes.get('/municipios', AuthHandler.authenticate, PaginationHandler.getPagination, async (req: ApiRequest, res: Response) => {
    const repo = AppDataSource.getRepository(Municipio);

    const provinciaId = req.query.provinciaId as string | undefined;

    const municipios: Municipio[] = await repo.find({ relations: ['provincia'], take: maxSize, skip: skip(req.offset!), where: { provincia: { id: provinciaId } } });
    return res.json(municipios);
});

routes.get('/localidades', AuthHandler.authenticate, PaginationHandler.getPagination, async (req: ApiRequest, res: Response) => {
    const repo = AppDataSource.getRepository(Localidad);

    const municipioId = req.query.municipioId as string | undefined;

    const localidades: Localidad[] = await repo.find({ relations: ['municipio'], take: maxSize, skip: skip(req.offset!), where: { municipio: { id: municipioId } } });
    return res.json(localidades);
});

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

    //
    const repo = AppDataSource.getRepository(Localidad);

    const localidadOrigen = await repo.findOneBy({ id: localidadOrigenId });
    const localidadDestino = await repo.findOneBy({ id: localidadDestinoId });

    if (!localidadOrigen)
        return res.status(422).json(new ErrorResponse(422, "No existe la localidad con id " + localidadOrigenId));

    if (!localidadDestino)
        return res.status(422).json(new ErrorResponse(422, "No existe la localidad con id " + localidadDestinoId));

    const randomDistance = getRandomDistance(1, 50);

    return res.json(new Distance(randomDistance.toFixed(3), "KM"));
});

const skip = (offset: number): number => {
    return (offset - 1) * maxSize;
}

const getRandomDistance = (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
}