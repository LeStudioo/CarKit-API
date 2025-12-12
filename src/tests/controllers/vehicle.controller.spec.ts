import { VehicleController } from '../../controllers/vehicle.controller';
import { VehicleService } from '../../services/vehicle.service';
import { Request, Response, NextFunction } from 'express';

describe('VehicleController', () => {
    let vehicleController: VehicleController;
    let mockVehicleService: any;
    let mockRequest: Partial<any>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockVehicleService = {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };

        vehicleController = new VehicleController();
        (vehicleController as any).vehicleService = mockVehicleService;

        mockRequest = {
            userId: 'user1',
            params: {},
            body: {},
        };

        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        mockNext = jest.fn();
    });

    describe('getAll', () => {
        it('should return all vehicles', async () => {
            const mockVehicles = [{ id: '1', brand: 'Toyota' }];
            mockVehicleService.findAll.mockResolvedValue(mockVehicles);

            await vehicleController.getAll(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.json).toHaveBeenCalledWith(mockVehicles);
        });

        it('should call next with error on failure', async () => {
            const error = new Error('Database error');
            mockVehicleService.findAll.mockRejectedValue(error);

            await vehicleController.getAll(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('getById', () => {
        it('should return a vehicle by id', async () => {
            const mockVehicle = { id: '1', brand: 'Toyota' };
            mockRequest.params = { id: '1' };
            mockVehicleService.findById.mockResolvedValue(mockVehicle);

            await vehicleController.getById(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.json).toHaveBeenCalledWith(mockVehicle);
        });
    });

    describe('create', () => {
        it('should create a vehicle', async () => {
            const vehicleData = { brand: 'Toyota', model: 'Corolla' };
            const mockVehicle = { ...vehicleData, id: '1' };
            mockRequest.body = vehicleData;
            mockVehicleService.create.mockResolvedValue(mockVehicle);

            await vehicleController.create(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(mockVehicle);
        });
    });

    describe('update', () => {
        it('should update a vehicle', async () => {
            const updateData = { brand: 'Honda' };
            const mockVehicle = { id: '1', brand: 'Honda' };
            mockRequest.params = { id: '1' };
            mockRequest.body = updateData;
            mockVehicleService.update.mockResolvedValue(mockVehicle);

            await vehicleController.update(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.json).toHaveBeenCalledWith(mockVehicle);
        });
    });

    describe('delete', () => {
        it('should delete a vehicle', async () => {
            mockRequest.params = { id: '1' };
            mockVehicleService.delete.mockResolvedValue(undefined);

            await vehicleController.delete(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(204);
            expect(mockResponse.send).toHaveBeenCalled();
        });
    });
});