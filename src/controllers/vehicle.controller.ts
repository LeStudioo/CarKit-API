import { Request, Response, NextFunction } from 'express';
import { VehicleService } from '../services/vehicle.service';

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
}