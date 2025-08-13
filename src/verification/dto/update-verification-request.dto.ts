import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsArray, IsObject } from 'class-validator';
import { VerificationStatus } from '../entities/verification-request.entity';

export class UpdateVerificationRequestDto {
  @ApiProperty({ description: 'Verification status', enum: VerificationStatus, required: false })
  @IsOptional()
  @IsEnum(VerificationStatus)
  status?: VerificationStatus;

  @ApiProperty({ description: 'Admin notes/reason for decision', required: false })
  @IsOptional()
  @IsString()
  adminNotes?: string;

  @ApiProperty({ description: 'Documents submitted for verification as JSON array', required: false })
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  documents?: Record<string, any>[];
}
