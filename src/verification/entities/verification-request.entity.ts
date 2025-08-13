import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Property } from '../../properties/entities/property.entity';
import { Payment } from '../../payments/entities/payment.entity';

export enum VerificationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  UNDER_REVIEW = 'under_review',
}

@Entity('verification_requests')
export class VerificationRequest {
  @ApiProperty({ description: 'Unique identifier for the verification request' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'ID of the property to be verified' })
  @Column({ nullable: false })
  propertyId: string;

  @ApiProperty({ description: 'ID of the user submitting the request' })
  @Column({ nullable: false })
  userId: string;

  @ApiProperty({ description: 'ID of the admin reviewing the request' })
  @Column({ nullable: true })
  adminId: string;

  @ApiProperty({ description: 'Verification status', enum: VerificationStatus })
  @Column({
    default: VerificationStatus.PENDING,
  })
  status: VerificationStatus;

  @ApiProperty({ description: 'Admin notes/reason for decision' })
  @Column({ type: 'text', nullable: true })
  adminNotes: string;

  @ApiProperty({ description: 'Documents submitted for verification as JSON' })
  @Column({ type: 'json', nullable: true })
  documents: Record<string, any>[];

  @ApiProperty({ description: 'Verification fee amount' })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  feeAmount: number;

  @ApiProperty({ description: 'Date when the request was submitted' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Date when the request was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: 'Date when the request was reviewed' })
  @Column({ nullable: true })
  reviewedAt: Date;

  // Relations
  @ManyToOne(() => Property, (property) => property.verificationRequests)
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @ManyToOne(() => User, (user) => user.verificationRequests)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'adminId' })
  admin: User;

  @OneToOne(() => Payment, (payment) => payment.verificationRequest)
  payment: Payment;
}
