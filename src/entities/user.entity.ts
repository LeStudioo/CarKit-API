import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { IsEmail, IsNotEmpty, IsBoolean } from 'class-validator';
import { VehicleEntity } from './vehicle.entity';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    @IsNotEmpty()
    providerUserId: string;

    @Column()
    @IsNotEmpty()
    provider: string; // 'apple' or 'google'

    @Column({ nullable: true })
    @IsEmail()
    email?: string;

    @Column({ default: false })
    @IsBoolean()
    isDeleted: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => VehicleEntity, vehicle => vehicle.user)
    vehicles: VehicleEntity[];
}