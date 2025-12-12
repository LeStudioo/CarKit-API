import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsEnum, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { MotorizationType } from '../enums/motorization-type.enum';
import { UserEntity } from './user.entity';
import { MileageEntity } from './mileage.entity';
import { SpendingEntity } from './spending.entity';

@Entity('vehicles')
export class VehicleEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @IsNotEmpty()
    brand: string;

    @Column()
    @IsNotEmpty()
    model: string;

    @Column()
    @IsNotEmpty()
    customName: string;

    @Column({ type: 'enum', enum: MotorizationType })
    @IsEnum(MotorizationType)
    motorization: MotorizationType;

    @Column({ nullable: true })
    @IsOptional()
    imageUrl?: string;

    @Column({ nullable: true })
    @IsOptional()
    @IsNumber()
    @Min(1900)
    @Max(new Date().getFullYear() + 1)
    year?: number;

    @Column()
    userId: string;

    @ManyToOne(() => UserEntity, user => user.vehicles)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @OneToMany(() => MileageEntity, mileage => mileage.vehicle)
    mileages: MileageEntity[];

    @OneToMany(() => SpendingEntity, spending => spending.vehicle)
    spendings: SpendingEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}