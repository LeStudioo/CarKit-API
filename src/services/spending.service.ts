import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { SpendingEntity } from '../entities/spending.entity';
import { VehicleService } from './vehicle.service';
import { AppError } from '../middlewares/error.middleware';

export class SpendingService {
    private spendingRepository: Repository<SpendingEntity>;
    private vehicleService: VehicleService;

    constructor() {
        this.spendingRepository = AppDataSource.getRepository(SpendingEntity);
        this.vehicleService = new VehicleService();
    }

    async findAll(vehicleId: string, userId: string): Promise<SpendingEntity[]> {
        await this.vehicleService.findById(vehicleId, userId);

        return this.spendingRepository.find({
            where: { vehicleId },
            order: { date: 'DESC' }
        });
    }

    async findById(id: string, vehicleId: string, userId: string): Promise<SpendingEntity> {
        await this.vehicleService.findById(vehicleId, userId);

        const spending = await this.spendingRepository.findOne({
            where: { id, vehicleId }
        });

        if (!spending) {
            throw new AppError(404, 'Spending entry not found');
        }

        return spending;
    }

    async create(data: Partial<SpendingEntity>, vehicleId: string, userId: string): Promise<SpendingEntity> {
        await this.vehicleService.findById(vehicleId, userId);

        const spending = this.spendingRepository.create({
            ...data,
            vehicleId
        });

        return this.spendingRepository.save(spending);
    }

    async update(id: string, data: Partial<SpendingEntity>, vehicleId: string, userId: string): Promise<SpendingEntity> {
        const spending = await this.findById(id, vehicleId, userId);

        Object.assign(spending, data);

        return this.spendingRepository.save(spending);
    }

    async delete(id: string, vehicleId: string, userId: string): Promise<void> {
        const spending = await this.findById(id, vehicleId, userId);
        await this.spendingRepository.remove(spending);
    }
}