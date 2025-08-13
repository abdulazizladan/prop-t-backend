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
import { VerificationService } from './verification.service';
import { CreateVerificationRequestDto } from './dto/create-verification-request.dto';
import { UpdateVerificationRequestDto } from './dto/update-verification-request.dto';
import { VerificationRequest } from './entities/verification-request.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';

@ApiTags('verification')
@ApiBearerAuth()
@Controller('verification')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a verification request for a property' })
  @ApiResponse({ status: 201, description: 'Verification request submitted successfully', type: VerificationRequest })
  create(@Body() createVerificationDto: CreateVerificationRequestDto, @Request() req): Promise<VerificationRequest> {
    return this.verificationService.create(createVerificationDto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all verification requests (admin only)' })
  @ApiResponse({ status: 200, description: 'List of all verification requests', type: [VerificationRequest] })
  findAll(): Promise<VerificationRequest[]> {
    return this.verificationService.findAll();
  }

  @Get('pending')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all pending verification requests (admin only)' })
  @ApiResponse({ status: 200, description: 'List of pending verification requests', type: [VerificationRequest] })
  findPending(): Promise<VerificationRequest[]> {
    return this.verificationService.findPending();
  }

  @Get('my-requests')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user verification requests' })
  @ApiResponse({ status: 200, description: 'List of user verification requests', type: [VerificationRequest] })
  findMyRequests(@Request() req): Promise<VerificationRequest[]> {
    return this.verificationService.findByUser(req.user.id);
  }

  @Get('property/:propertyId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get verification requests for a specific property' })
  @ApiResponse({ status: 200, description: 'List of verification requests for property', type: [VerificationRequest] })
  findByProperty(@Param('propertyId') propertyId: string): Promise<VerificationRequest[]> {
    return this.verificationService.findByProperty(propertyId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get verification request by ID' })
  @ApiResponse({ status: 200, description: 'Verification request found', type: VerificationRequest })
  @ApiResponse({ status: 404, description: 'Verification request not found' })
  findOne(@Param('id') id: string): Promise<VerificationRequest> {
    return this.verificationService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update verification request (admin only)' })
  @ApiResponse({ status: 200, description: 'Verification request updated successfully', type: VerificationRequest })
  @ApiResponse({ status: 403, description: 'Forbidden - admin access required' })
  @ApiResponse({ status: 404, description: 'Verification request not found' })
  update(
    @Param('id') id: string,
    @Body() updateVerificationDto: UpdateVerificationRequestDto,
    @Request() req,
  ): Promise<VerificationRequest> {
    return this.verificationService.update(id, updateVerificationDto, req.user.id);
  }

  @Post(':id/approve')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve verification request (admin only)' })
  @ApiResponse({ status: 200, description: 'Verification request approved successfully', type: VerificationRequest })
  approve(
    @Param('id') id: string,
    @Body() body: { adminNotes?: string },
    @Request() req,
  ): Promise<VerificationRequest> {
    return this.verificationService.approve(id, req.user.id, body.adminNotes);
  }

  @Post(':id/reject')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject verification request (admin only)' })
  @ApiResponse({ status: 200, description: 'Verification request rejected successfully', type: VerificationRequest })
  reject(
    @Param('id') id: string,
    @Body() body: { adminNotes: string },
    @Request() req,
  ): Promise<VerificationRequest> {
    return this.verificationService.reject(id, req.user.id, body.adminNotes);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete verification request (admin only)' })
  @ApiResponse({ status: 200, description: 'Verification request deleted successfully' })
  @ApiResponse({ status: 404, description: 'Verification request not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.verificationService.remove(id);
  }
}
