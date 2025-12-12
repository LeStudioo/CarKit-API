import { DataSource } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { VehicleEntity } from '../entities/vehicle.entity';
import { MileageEntity } from '../entities/mileage.entity';
import { SpendingEntity } from '../entities/spending.entity';
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'carkit_api',
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    entities: [UserEntity, VehicleEntity, MileageEntity, SpendingEntity],
    migrations: [],
    subscribers: [],
});