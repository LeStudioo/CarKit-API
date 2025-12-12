import { MileageService } from '../../services/mileage.service';
import { VehicleService } from '../../services/vehicle.service';
import { AppDataSource } from '../../config/database';
import { AppError } from '../../middlewares/error.middleware';

describe('MileageService', () => {
    let mileageService: MileageService;
    let mockRepository: any;
    let mockVehicleService: any;

    beforeEach(() => {
        mockRepository = {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
        };

        mockVehicleService = {
            findById: jest.fn(),
        };

        jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(mockRepository as any);
        mileageService = new MileageService();
        (mileageService as any).vehicleService = mockVehicleService;
    });

    describe('findAll', () => {
        it('should return all mileages for a vehicle', async () => {
            const mockMileages = [
                { id: '1', mileage: 10000, vehicleId: 'v1' },
                { id: '2', mileage: 15000, vehicleId: 'v1' },
            ];
            mockVehicleService.findById.mockResolvedValue({ id: 'v1' });
            mockRepository.find.mockResolvedValue(mockMileages);

            const result = await mileageService.findAll('v1', 'user1');

            expect(result).toEqual(mockMileages);
            expect(mockVehicleService.findById).toHaveBeenCalledWith('v1', 'user1');
        });
    });

    describe('findById', () => {
        it('should return a mileage by id', async () => {
            const mockMileage = { id: '1', mileage: 10000, vehicleId: 'v1' };
            mockVehicleService.findById.mockResolvedValue({ id: 'v1' });
            mockRepository.findOne.mockResolvedValue(mockMileage);

            const result = await mileageService.findById('1', 'v1', 'user1');

            expect(result).toEqual(mockMileage);
        });

        it('should throw AppError if mileage not found', async () => {
            mockVehicleService.findById.mockResolvedValue({ id: 'v1' });
            mockRepository.findOne.mockResolvedValue(null);

            await expect(mileageService.findById('999', 'v1', 'user1')).rejects.toThrow(AppError);
        });
    });

    describe('create', () => {
        it('should create a new mileage entry', async () => {
            const mileageData = {
                mileage: 10000,
                date: new Date(),
                isSetupEntry: false,
            };
            const mockMileage = { ...mileageData, id: '1', vehicleId: 'v1' };

            mockVehicleService.findById.mockResolvedValue({ id: 'v1' });
            mockRepository.create.mockReturnValue(mockMileage);
            mockRepository.save.mockResolvedValue(mockMileage);

            const result = await mileageService.create(mileageData, 'v1', 'user1');

            expect(result).toEqual(mockMileage);
        });
    });

    describe('update', () => {
        it('should update an existing mileage', async () => {
            const existingMileage = { id: '1', mileage: 10000, vehicleId: 'v1' };
            const updateData = { mileage: 15000 };
            const updatedMileage = { ...existingMileage, ...updateData };

            mockVehicleService.findById.mockResolvedValue({ id: 'v1' });
            mockRepository.findOne.mockResolvedValue(existingMileage);
            mockRepository.save.mockResolvedValue(updatedMileage);

            const result = await mileageService.update('1', updateData, 'v1', 'user1');

            expect(result.mileage).toBe(15000);
        });
    });

    describe('delete', () => {
        it('should delete a mileage entry', async () => {
            const mockMileage = { id: '1', mileage: 10000, vehicleId: 'v1' };
            mockVehicleService.findById.mockResolvedValue({ id: 'v1' });
            mockRepository.findOne.mockResolvedValue(mockMileage);
            mockRepository.remove.mockResolvedValue(mockMileage);

            await mileageService.delete('1', 'v1', 'user1');

            expect(mockRepository.remove).toHaveBeenCalledWith(mockMileage);
        });
    });
});