import { UserService } from '../../services/user.service';
import { AppDataSource } from '../../config/database';
import { AppError } from '../../middlewares/error.middleware';

describe('UserService', () => {
    let userService: UserService;
    let mockRepository: any;

    beforeEach(() => {
        mockRepository = {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
        };

        jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(mockRepository as any);
        userService = new UserService();
    });

    describe('findById', () => {
        it('should return a user by id', async () => {
            const mockUser = { id: '1', email: 'test@example.com', isDeleted: false };
            mockRepository.findOne.mockResolvedValue(mockUser);

            const result = await userService.findById('1');

            expect(result).toEqual(mockUser);
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: '1', isDeleted: false },
            });
        });

        it('should return null if user not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            const result = await userService.findById('999');

            expect(result).toBeNull();
        });
    });

    describe('findByProviderUserId', () => {
        it('should return a user by provider user id', async () => {
            const mockUser = { id: '1', providerUserId: 'apple123', provider: 'apple' };
            mockRepository.findOne.mockResolvedValue(mockUser);

            const result = await userService.findByProviderUserId('apple123', 'apple');

            expect(result).toEqual(mockUser);
        });
    });

    describe('create', () => {
        it('should create a new user', async () => {
            const userData = {
                providerUserId: 'apple123',
                provider: 'apple',
                email: 'test@example.com',
            };
            const mockUser = { ...userData, id: '1' };

            mockRepository.create.mockReturnValue(mockUser);
            mockRepository.save.mockResolvedValue(mockUser);

            const result = await userService.create('apple123', 'apple', 'test@example.com');

            expect(result).toEqual(mockUser);
        });
    });

    describe('delete', () => {
        it('should soft delete a user', async () => {
            const mockUser = { id: '1', isDeleted: false };
            mockRepository.findOne.mockResolvedValue(mockUser);
            mockRepository.save.mockResolvedValue({ ...mockUser, isDeleted: true });

            await userService.delete('1');

            expect(mockRepository.save).toHaveBeenCalledWith({ ...mockUser, isDeleted: true });
        });

        it('should throw AppError if user not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(userService.delete('999')).rejects.toThrow(AppError);
        });
    });
});