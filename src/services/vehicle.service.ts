import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { VehicleEntity } from '../entities/vehicle.entity';
import { AppError } from '../middlewares/error.middleware';

export class VehicleService {
    private vehicleRepository: Repository<VehicleEntity>;

    constructor() {
        this.vehicleRepository = AppDataSource.getRepository(VehicleEntity);
    }

    async findAll(userId: string): Promise<VehicleEntity[]> {
        return this.vehicleRepository.find({
            where: { userId },
            relations: ['mileages', 'spendings']
        });
    }

    async findById(id: string, userId: string): Promise<VehicleEntity> {
        const vehicle = await this.vehicleRepository.findOne({
            where: { id, userId },
            relations: ['mileages', 'spendings']
        });

        if (!vehicle) {
            throw new AppError(404, 'Vehicle not found');
        }

        return vehicle;
    }

    async create(data: Partial<VehicleEntity>, userId: string): Promise<VehicleEntity> {
        const vehicle = this.vehicleRepository.create({
            ...data,
            userId
        });

        return this.vehicleRepository.save(vehicle);
    }

    async update(id: string, data: Partial<VehicleEntity>, userId: string): Promise<VehicleEntity> {
        const vehicle = await this.findById(id, userId);

        Object.assign(vehicle, data);

        return this.vehicleRepository.save(vehicle);
    }

    async delete(id: string, userId: string): Promise<void> {
        const vehicle = await this.findById(id, userId);
        await this.vehicleRepository.remove(vehicle);
    }
}