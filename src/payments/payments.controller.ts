import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './entities/payment.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';

@ApiTags('payments')
@ApiBearerAuth()
@Controller('payments')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({ status: 201, description: 'Payment created successfully', type: Payment })
  create(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all payments (admin only)' })
  @ApiResponse({ status: 200, description: 'List of all payments', type: [Payment] })
  findAll(): Promise<Payment[]> {
    return this.paymentsService.findAll();
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment statistics (admin only)' })
  @ApiResponse({ status: 200, description: 'Payment statistics' })
  getStats() {
    return this.paymentsService.getPaymentStats();
  }

  @Get('verification-request/:verificationRequestId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payments for a specific verification request' })
  @ApiResponse({ status: 200, description: 'List of payments for verification request', type: [Payment] })
  findByVerificationRequest(@Param('verificationRequestId') verificationRequestId: string): Promise<Payment[]> {
    return this.paymentsService.findByVerificationRequest(verificationRequestId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment found', type: Payment })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  findOne(@Param('id') id: string): Promise<Payment> {
    return this.paymentsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update payment by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'Payment updated successfully', type: Payment })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  update(@Param('id') id: string, @Body() updatePaymentDto: Partial<Payment>): Promise<Payment> {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @Post(':id/process')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Process a payment (webhook endpoint)' })
  @ApiResponse({ status: 200, description: 'Payment processed successfully', type: Payment })
  async processPayment(
    @Param('id') id: string,
    @Body() body: { gatewayTransactionId: string; gatewayResponse: any },
  ): Promise<Payment> {
    return this.paymentsService.processPayment(id, body.gatewayTransactionId, body.gatewayResponse);
  }

  @Post(':id/fail')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark payment as failed (webhook endpoint)' })
  @ApiResponse({ status: 200, description: 'Payment marked as failed', type: Payment })
  async markAsFailed(
    @Param('id') id: string,
    @Body() body: { gatewayResponse: any },
  ): Promise<Payment> {
    return this.paymentsService.markAsFailed(id, body.gatewayResponse);
  }

  @Post(':id/refund')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refund a payment (admin only)' })
  @ApiResponse({ status: 200, description: 'Payment refunded successfully', type: Payment })
  async refundPayment(@Param('id') id: string): Promise<Payment> {
    return this.paymentsService.refundPayment(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete payment by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'Payment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.paymentsService.remove(id);
  }
}
