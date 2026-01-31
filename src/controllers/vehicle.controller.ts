import { Request, Response, NextFunction } from 'express';
import { VehicleService } from '../services/vehicle.service';
import path from "path";
import fs from "fs";

export class VehicleController {
    private vehicleService: VehicleService;

    constructor() {
        this.vehicleService = new VehicleService();
    }

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const vehicles = await this.vehicleService.findAll(req.userId!);
            res.json(vehicles);
        } catch (error) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const vehicle = await this.vehicleService.findById(req.params.id, req.userId!);
            res.json(vehicle);
        } catch (error) {
            next(error);
        }
    };

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const vehicle = await this.vehicleService.create(req.body, req.userId!);
            res.status(201).json(vehicle);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const vehicle = await this.vehicleService.update(req.params.id, req.body, req.userId!);
            res.json(vehicle);
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.vehicleService.delete(req.params.id, req.userId!);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };

    uploadImage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'Aucune image fournie' });
            }

            const filename = req.file.filename;
            const vehicle = await this.vehicleService.update(
                req.params.id,
                { imageUrl: filename },
                req.userId!
            );

            res.json({ imageUrl: filename });
        } catch (error) {
            // Supprimer le fichier si l'update échoue
            if (req.file) {
                const filepath = path.join(process.env.STORAGE_FOLDER || './uploads', req.file.filename);
                if (fs.existsSync(filepath)) {
                    fs.unlinkSync(filepath);
                }
            }
            next(error);
        }
    };
}