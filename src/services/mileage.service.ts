import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { MileageEntity } from '../entities/mileage.entity';
import { VehicleService } from './vehicle.service';
import { AppError } from '../middlewares/error.middleware';

export class MileageService {
    private mileageRepository: Repository<MileageEntity>;
    private vehicleService: VehicleService;

    constructor() {
        this.mileageRepository = AppDataSource.getRepository(MileageEntity);
        this.vehicleService = new VehicleService();
    }

    async findAll(vehicleId: string, userId: string): Promise<MileageEntity[]> {
        await this.vehicleService.findById(vehicleId, userId);

        return this.mileageRepository.find({
            where: { vehicleId },
            order: { date: 'DESC' }
        });
    }

    async findById(id: string, vehicleId: string, userId: string): Promise<MileageEntity> {
        await this.vehicleService.findById(vehicleId, userId);

        const mileage = await this.mileageRepository.findOne({
            where: { id, vehicleId }
        });

        if (!mileage) {
            throw new AppError(404, 'Mileage entry not found');
        }

        return mileage;
    }

    async create(data: Partial<MileageEntity>, vehicleId: string, userId: string): Promise<MileageEntity> {
        await this.vehicleService.findById(vehicleId, userId);

        const mileage = this.mileageRepository.create({
            ...data,
            vehicleId
        });

        return this.mileageRepository.save(mileage);
    }

    async update(id: string, data: Partial<MileageEntity>, vehicleId: string, userId: string): Promise<MileageEntity> {
        const mileage = await this.findById(id, vehicleId, userId);

        Object.assign(mileage, data);

        return this.mileageRepository.save(mileage);
    }

    async delete(id: string, vehicleId: string, userId: string): Promise<void> {
        const mileage = await this.findById(id, vehicleId, userId);
        await this.mileageRepository.remove(mileage);
    }
}