import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsNumber, IsDate, IsBoolean, Min } from 'class-validator';
import { VehicleEntity } from './vehicle.entity';
import { Type } from 'class-transformer';

@Entity('mileages')
export class MileageEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int' })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    mileage: number;

    @Column({ type: 'date' })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    date: Date;

    @Column({ default: false })
    @IsBoolean()
    isSetupEntry: boolean;

    @Column()
    vehicleId: string;

    @ManyToOne(() => VehicleEntity, vehicle => vehicle.mileages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'vehicleId' })
    vehicle: VehicleEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}