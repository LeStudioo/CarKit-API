import { SpendingService } from '../../services/spending.service';
import { VehicleService } from '../../services/vehicle.service';
import { AppDataSource } from '../../config/database';
import { AppError } from '../../middlewares/error.middleware';
import { RecurrenceType } from '../../enums/recurrence-type.enum';
import { SpendingType } from '../../enums/spending-type.enum';

describe('SpendingService', () => {
    let spendingService: SpendingService;
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
        spendingService = new SpendingService();
        (spendingService as any).vehicleService = mockVehicleService;
    });

    describe('findAll', () => {
        it('should return all spendings for a vehicle', async () => {
            const mockSpendings = [
                { id: '1', amount: 50, vehicleId: 'v1' },
                { id: '2', amount: 100, vehicleId: 'v1' },
            ];
            mockVehicleService.findById.mockResolvedValue({ id: 'v1' });
            mockRepository.find.mockResolvedValue(mockSpendings);

            const result = await spendingService.findAll('v1', 'user1');

            expect(result).toEqual(mockSpendings);
        });
    });

    describe('findById', () => {
        it('should return a spending by id', async () => {
            const mockSpending = { id: '1', amount: 50, vehicleId: 'v1' };
            mockVehicleService.findById.mockResolvedValue({ id: 'v1' });
            mockRepository.findOne.mockResolvedValue(mockSpending);

            const result = await spendingService.findById('1', 'v1', 'user1');

            expect(result).toEqual(mockSpending);
        });

        it('should throw AppError if spending not found', async () => {
            mockVehicleService.findById.mockResolvedValue({ id: 'v1' });
            mockRepository.findOne.mockResolvedValue(null);

            await expect(spendingService.findById('999', 'v1', 'user1')).rejects.toThrow(AppError);
        });
    });

    describe('create', () => {
        it('should create a new spending entry', async () => {
            const spendingData = {
                amount: 50,
                date: new Date(),
                recurrence: RecurrenceType.NONE,
                type: SpendingType.FUEL,
                currencyCode: 'EUR',
            };
            const mockSpending = { ...spendingData, id: '1', vehicleId: 'v1' };

            mockVehicleService.findById.mockResolvedValue({ id: 'v1' });
            mockRepository.create.mockReturnValue(mockSpending);
            mockRepository.save.mockResolvedValue(mockSpending);

            const result = await spendingService.create(spendingData, 'v1', 'user1');

            expect(result).toEqual(mockSpending);
        });
    });

    describe('update', () => {
        it('should update an existing spending', async () => {
            const existingSpending = { id: '1', amount: 50, vehicleId: 'v1' };
            const updateData = { amount: 75 };
            const updatedSpending = { ...existingSpending, ...updateData };

            mockVehicleService.findById.mockResolvedValue({ id: 'v1' });
            mockRepository.findOne.mockResolvedValue(existingSpending);
            mockRepository.save.mockResolvedValue(updatedSpending);

            const result = await spendingService.update('1', updateData, 'v1', 'user1');

            expect(result.amount).toBe(75);
        });
    });

    describe('delete', () => {
        it('should delete a spending entry', async () => {
            const mockSpending = { id: '1', amount: 50, vehicleId: 'v1' };
            mockVehicleService.findById.mockResolvedValue({ id: 'v1' });
            mockRepository.findOne.mockResolvedValue(mockSpending);
            mockRepository.remove.mockResolvedValue(mockSpending);

            await spendingService.delete('1', 'v1', 'user1');

            expect(mockRepository.remove).toHaveBeenCalledWith(mockSpending);
        });
    });
});