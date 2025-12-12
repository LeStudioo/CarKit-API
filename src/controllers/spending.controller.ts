import { Request, Response, NextFunction } from 'express';
import { SpendingService } from '../services/spending.service';

export class SpendingController {
    private spendingService: SpendingService;

    constructor() {
        this.spendingService = new SpendingService();
    }

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const spendings = await this.spendingService.findAll(req.params.vehicleId, req.userId!);
            res.json(spendings);
        } catch (error) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const spending = await this.spendingService.findById(req.params.id, req.params.vehicleId, req.userId!);
            res.json(spending);
        } catch (error) {
            next(error);
        }
    };

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const spending = await this.spendingService.create(req.body, req.params.vehicleId, req.userId!);
            res.status(201).json(spending);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const spending = await this.spendingService.update(req.params.id, req.body, req.params.vehicleId, req.userId!);
            res.json(spending);
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.spendingService.delete(req.params.id, req.params.vehicleId, req.userId!);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}