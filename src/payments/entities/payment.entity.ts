import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { VerificationRequest } from '../../verification/entities/verification-request.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  PAYPAL = 'paypal',
  STRIPE = 'stripe',
}

@Entity('payments')
export class Payment {
  @ApiProperty({ description: 'Unique identifier for the payment' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'ID of the verification request associated with this payment' })
  @Column({ nullable: false })
  verificationRequestId: string;

  @ApiProperty({ description: 'Payment amount' })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  amount: number;

  @ApiProperty({ description: 'Payment currency' })
  @Column({ default: 'USD' })
  currency: string;

  @ApiProperty({ description: 'Payment status', enum: PaymentStatus })
  @Column({
    default: PaymentStatus.PENDING,
  })
  status: string;

  @ApiProperty({ description: 'Payment method used', enum: PaymentMethod })
  @Column({
    nullable: false,
  })
  method: string;

  @ApiProperty({ description: 'External payment gateway transaction ID' })
  @Column({ nullable: true })
  gatewayTransactionId: string;

  @ApiProperty({ description: 'Payment gateway response data as JSON' })
  @Column({ type: 'json', nullable: true })
  gatewayResponse: Record<string, any>;

  @ApiProperty({ description: 'Payment description' })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ description: 'Payment metadata as JSON' })
  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @ApiProperty({ description: 'Date when the payment was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Date when the payment was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: 'Date when the payment was completed' })
  @Column({ nullable: true })
  completedAt: Date;

  // Relations
  @OneToOne(() => VerificationRequest, (request) => request.payment)
  @JoinColumn({ name: 'verificationRequestId' })
  verificationRequest: VerificationRequest;
}
