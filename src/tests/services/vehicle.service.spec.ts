import { VehicleService } from '../../services/vehicle.service';
import { VehicleEntity } from '../../entities/vehicle.entity';
import { AppDataSource } from '../../config/database';
import { MotorizationType } from '../../enums/motorization-type.enum';
import { AppError } from '../../middlewares/error.middleware';

describe('VehicleService', () => {
    let vehicleService: VehicleService;
    let mockRepository: any;

    beforeEach(() => {
        mockRepository = {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
        };

        jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(mockRepository as any);
        vehicleService = new VehicleService();
    });

    describe('findAll', () => {
        it('should return all vehicles for a user', async () => {
            const mockVehicles = [
                { id: '1', brand: 'Toyota', userId: 'user1' },
                { id: '2', brand: 'Honda', userId: 'user1' },
            ];
            mockRepository.find.mockResolvedValue(mockVehicles);

            const result = await vehicleService.findAll('user1');

            expect(result).toEqual(mockVehicles);
            expect(mockRepository.find).toHaveBeenCalledWith({
                where: { userId: 'user1' },
                relations: ['mileages', 'spendings'],
            });
        });
    });

    describe('findById', () => {
        it('should return a vehicle by id', async () => {
            const mockVehicle = { id: '1', brand: 'Toyota', userId: 'user1' };
            mockRepository.findOne.mockResolvedValue(mockVehicle);

            const result = await vehicleService.findById('1', 'user1');

            expect(result).toEqual(mockVehicle);
        });

        it('should throw AppError if vehicle not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(vehicleService.findById('999', 'user1')).rejects.toThrow(AppError);
        });
    });

    describe('create', () => {
        it('should create a new vehicle', async () => {
            const vehicleData = {
                brand: 'Toyota',
                model: 'Corolla',
                customName: 'My Car',
                motorization: MotorizationType.HYBRID,
            };
            const mockVehicle = { ...vehicleData, id: '1', userId: 'user1' };

            mockRepository.create.mockReturnValue(mockVehicle);
            mockRepository.save.mockResolvedValue(mockVehicle);

            const result = await vehicleService.create(vehicleData, 'user1');

            expect(result).toEqual(mockVehicle);
            expect(mockRepository.create).toHaveBeenCalledWith({
                ...vehicleData,
                userId: 'user1',
            });
        });
    });

    describe('update', () => {
        it('should update an existing vehicle', async () => {
            const existingVehicle = { id: '1', brand: 'Toyota', userId: 'user1' };
            const updateData = { brand: 'Honda' };
            const updatedVehicle = { ...existingVehicle, ...updateData };

            mockRepository.findOne.mockResolvedValue(existingVehicle);
            mockRepository.save.mockResolvedValue(updatedVehicle);

            const result = await vehicleService.update('1', updateData, 'user1');

            expect(result.brand).toBe('Honda');
            expect(mockRepository.save).toHaveBeenCalled();
        });
    });

    describe('delete', () => {
        it('should delete a vehicle', async () => {
            const mockVehicle = { id: '1', brand: 'Toyota', userId: 'user1' };
            mockRepository.findOne.mockResolvedValue(mockVehicle);
            mockRepository.remove.mockResolvedValue(mockVehicle);

            await vehicleService.delete('1', 'user1');

            expect(mockRepository.remove).toHaveBeenCalledWith(mockVehicle);
        });
    });
});