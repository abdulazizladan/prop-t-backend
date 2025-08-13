import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { VerificationRequest } from '../../verification/entities/verification-request.entity';

export enum PropertyType {
  HOUSE = 'house',
  APARTMENT = 'apartment',
  CONDO = 'condo',
  TOWNHOUSE = 'townhouse',
  LAND = 'land',
  COMMERCIAL = 'commercial',
}

export enum PropertyStatus {
  AVAILABLE = 'available',
  SOLD = 'sold',
  RENTED = 'rented',
  PENDING = 'pending',
}

@Entity('properties')
export class Property {
  @ApiProperty({ description: 'Unique identifier for the property' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Property title' })
  @Column({ nullable: false })
  title: string;

  @ApiProperty({ description: 'Property description' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'Property location/address' })
  @Column({ nullable: false })
  location: string;

  @ApiProperty({ description: 'Property price' })
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: false })
  price: number;

  @ApiProperty({ description: 'Property type', enum: PropertyType })
  @Column({
    nullable: false,
  })
  type: string;

  @ApiProperty({ description: 'Property status' })
  @Column({
    default: PropertyStatus.AVAILABLE,
  })
  status: string;

  @ApiProperty({ description: 'Property images as JSON array' })
  @Column({ type: 'json', nullable: true })
  images: string[];

  @ApiProperty({ description: 'Property features as JSON' })
  @Column({ type: 'json', nullable: true })
  features: Record<string, any>;

  @ApiProperty({ description: 'Property specifications as JSON' })
  @Column({ type: 'json', nullable: true })
  specifications: Record<string, any>;

  @ApiProperty({ description: 'Whether the property is verified' })
  @Column({ default: false })
  isVerified: boolean;

  @ApiProperty({ description: 'Property rating (average)' })
  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @ApiProperty({ description: 'Number of ratings' })
  @Column({ default: 0 })
  ratingCount: number;

  @ApiProperty({ description: 'Property views count' })
  @Column({ default: 0 })
  views: number;

  @ApiProperty({ description: 'Date when the property was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Date when the property was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ApiProperty({ description: 'ID of the user who listed the property' })
  @Column({ nullable: false })
  listerId: string;

  @ManyToOne(() => User, (user) => user.properties)
  @JoinColumn({ name: 'listerId' })
  lister: User;

  @OneToMany(() => VerificationRequest, (request) => request.property)
  verificationRequests: VerificationRequest[];
}
