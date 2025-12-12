import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { UserEntity } from '../entities/user.entity';
import { AppError } from '../middlewares/error.middleware';

export class UserService {
    private userRepository: Repository<UserEntity>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(UserEntity);
    }

    async findById(id: string): Promise<UserEntity | null> {
        return this.userRepository.findOne({ where: { id, isDeleted: false } });
    }

    async findByProviderUserId(providerUserId: string, provider: string): Promise<UserEntity | null> {
        return this.userRepository.findOne({
            where: { providerUserId, provider, isDeleted: false }
        });
    }

    async create(providerUserId: string, provider: string, email?: string): Promise<UserEntity> {
        const user = this.userRepository.create({
            providerUserId,
            provider,
            email
        });

        return this.userRepository.save(user);
    }

    async delete(id: string): Promise<void> {
        const user = await this.findById(id);

        if (!user) {
            throw new AppError(404, 'User not found');
        }

        user.isDeleted = true;
        await this.userRepository.save(user);
    }
}