import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsEnum, IsOptional, IsNumber, IsDate, Min } from 'class-validator';
import { RecurrenceType } from '../enums/recurrence-type.enum';
import { SpendingType } from '../enums/spending-type.enum';
import { ServiceType } from '../enums/service-type.enum';
import { VehicleEntity } from './vehicle.entity';
import { Type } from 'class-transformer';
import { ColumnNumericTransformer } from "../config/transformer";

@Entity('spendings')
export class SpendingEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'numeric', transformer: new ColumnNumericTransformer(), precision: 10, scale: 2, nullable: true })
    @IsOptional()
    @IsNumber()
    @Min(0)
    amount?: number;

    @Column({ type: 'date' })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    date: Date;

    @Column({ type: 'enum', enum: RecurrenceType })
    @IsEnum(RecurrenceType)
    recurrence: RecurrenceType;

    @Column({ type: 'enum', enum: SpendingType })
    @IsEnum(SpendingType)
    type: SpendingType;

    @Column({ length: 3 })
    @IsNotEmpty()
    currencyCode: string;

    @Column({ nullable: true })
    @IsOptional()
    name?: string;

    @Column({ type: 'enum', enum: ServiceType, nullable: true })
    @IsOptional()
    @IsEnum(ServiceType)
    service?: ServiceType;

    @Column({ type: 'numeric', transformer: new ColumnNumericTransformer(), precision: 10, scale: 2, nullable: true })
    @IsOptional()
    @IsNumber()
    @Min(0)
    literQuantity?: number;

    @Column({ type: 'numeric', transformer: new ColumnNumericTransformer(), precision: 10, scale: 2, nullable: true })
    @IsOptional()
    @IsNumber()
    @Min(0)
    elecQuantity?: number;

    @Column({ nullable: true })
    @IsOptional()
    literUnit?: string;

    @Column()
    vehicleId: string;

    @ManyToOne(() => VehicleEntity, vehicle => vehicle.spendings, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'vehicleId' })
    vehicle: VehicleEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}