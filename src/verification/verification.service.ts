import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerificationRequest } from './entities/verification-request.entity';
import { CreateVerificationRequestDto } from './dto/create-verification-request.dto';
import { UpdateVerificationRequestDto } from './dto/update-verification-request.dto';
import { VerificationStatus } from './entities/verification-request.entity';

@Injectable()
export class VerificationService {
  constructor(
    @InjectRepository(VerificationRequest)
    private readonly verificationRepository: Repository<VerificationRequest>,
  ) {}

  async create(createVerificationDto: CreateVerificationRequestDto, userId: string): Promise<VerificationRequest> {
    const verificationRequest = this.verificationRepository.create({
      ...createVerificationDto,
      userId,
    });

    return this.verificationRepository.save(verificationRequest);
  }

  async findAll(): Promise<VerificationRequest[]> {
    return this.verificationRepository.find({
      relations: ['property', 'user', 'admin'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<VerificationRequest> {
    const verificationRequest = await this.verificationRepository.findOne({
      where: { id },
      relations: ['property', 'user', 'admin', 'payment'],
    });

    if (!verificationRequest) {
      throw new NotFoundException(`Verification request with ID ${id} not found`);
    }

    return verificationRequest;
  }

  async findByUser(userId: string): Promise<VerificationRequest[]> {
    return this.verificationRepository.find({
      where: { userId },
      relations: ['property', 'payment'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByProperty(propertyId: string): Promise<VerificationRequest[]> {
    return this.verificationRepository.find({
      where: { propertyId },
      relations: ['user', 'payment'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateVerificationDto: UpdateVerificationRequestDto, adminId: string): Promise<VerificationRequest> {
    const verificationRequest = await this.findOne(id);

    // Only admins can update verification requests
    if (!adminId) {
      throw new ForbiddenException('Only admins can update verification requests');
    }

    Object.assign(verificationRequest, {
      ...updateVerificationDto,
      adminId,
      reviewedAt: new Date(),
    });

    return this.verificationRepository.save(verificationRequest);
  }

  async remove(id: string): Promise<void> {
    const verificationRequest = await this.findOne(id);
    await this.verificationRepository.remove(verificationRequest);
  }

  async findPending(): Promise<VerificationRequest[]> {
    return this.verificationRepository.find({
      where: { status: VerificationStatus.PENDING },
      relations: ['property', 'user'],
      order: { createdAt: 'ASC' },
    });
  }

  async approve(id: string, adminId: string, adminNotes?: string): Promise<VerificationRequest> {
    return this.update(id, {
      status: VerificationStatus.APPROVED,
      adminNotes,
    }, adminId);
  }

  async reject(id: string, adminId: string, adminNotes: string): Promise<VerificationRequest> {
    return this.update(id, {
      status: VerificationStatus.REJECTED,
      adminNotes,
    }, adminId);
  }
}
