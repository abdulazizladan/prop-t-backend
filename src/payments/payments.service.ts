import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentStatus } from './entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentRepository.create({
      ...createPaymentDto,
      status: PaymentStatus.PENDING,
    });

    return this.paymentRepository.save(payment);
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find({
      relations: ['verificationRequest'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['verificationRequest'],
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  async findByVerificationRequest(verificationRequestId: string): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { verificationRequestId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updatePaymentDto: Partial<Payment>): Promise<Payment> {
    const payment = await this.findOne(id);
    Object.assign(payment, updatePaymentDto);
    
    if (updatePaymentDto.status === PaymentStatus.COMPLETED) {
      payment.completedAt = new Date();
    }
    
    return this.paymentRepository.save(payment);
  }

  async remove(id: string): Promise<void> {
    const payment = await this.findOne(id);
    await this.paymentRepository.remove(payment);
  }

  async processPayment(id: string, gatewayTransactionId: string, gatewayResponse: any): Promise<Payment> {
    const payment = await this.findOne(id);
    
    payment.gatewayTransactionId = gatewayTransactionId;
    payment.gatewayResponse = gatewayResponse;
    payment.status = PaymentStatus.COMPLETED;
    payment.completedAt = new Date();
    
    return this.paymentRepository.save(payment);
  }

  async markAsFailed(id: string, gatewayResponse: any): Promise<Payment> {
    const payment = await this.findOne(id);
    
    payment.gatewayResponse = gatewayResponse;
    payment.status = PaymentStatus.FAILED;
    
    return this.paymentRepository.save(payment);
  }

  async refundPayment(id: string): Promise<Payment> {
    const payment = await this.findOne(id);
    
    payment.status = PaymentStatus.REFUNDED;
    
    return this.paymentRepository.save(payment);
  }

  async getPaymentStats(): Promise<{
    totalPayments: number;
    totalAmount: number;
    completedPayments: number;
    pendingPayments: number;
    failedPayments: number;
  }> {
    const [totalPayments, totalAmount, completedPayments, pendingPayments, failedPayments] = await Promise.all([
      this.paymentRepository.count(),
      this.paymentRepository
        .createQueryBuilder('payment')
        .select('SUM(payment.amount)', 'total')
        .where('payment.status = :status', { status: PaymentStatus.COMPLETED })
        .getRawOne(),
      this.paymentRepository.count({ where: { status: PaymentStatus.COMPLETED } }),
      this.paymentRepository.count({ where: { status: PaymentStatus.PENDING } }),
      this.paymentRepository.count({ where: { status: PaymentStatus.FAILED } }),
    ]);

    return {
      totalPayments,
      totalAmount: parseFloat(totalAmount?.total || '0'),
      completedPayments,
      pendingPayments,
      failedPayments,
    };
  }
}
