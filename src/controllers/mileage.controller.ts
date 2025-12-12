import { Request, Response, NextFunction } from 'express';
import { MileageService } from '../services/mileage.service';

export class MileageController {
    private mileageService: MileageService;

    constructor() {
        this.mileageService = new MileageService();
    }

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const mileages = await this.mileageService.findAll(req.params.vehicleId, req.userId!);
            res.json(mileages);
        } catch (error) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const mileage = await this.mileageService.findById(req.params.id, req.params.vehicleId, req.userId!);
            res.json(mileage);
        } catch (error) {
            next(error);
        }
    };

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const mileage = await this.mileageService.create(req.body, req.params.vehicleId, req.userId!);
            res.status(201).json(mileage);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const mileage = await this.mileageService.update(req.params.id, req.body, req.params.vehicleId, req.userId!);
            res.json(mileage);
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.mileageService.delete(req.params.id, req.params.vehicleId, req.userId!);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}