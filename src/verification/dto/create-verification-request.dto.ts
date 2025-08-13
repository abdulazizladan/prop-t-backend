import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, IsOptional, IsObject, Min } from 'class-validator';

export class CreateVerificationRequestDto {
  @ApiProperty({ description: 'ID of the property to be verified' })
  @IsString()
  propertyId: string;

  @ApiProperty({ description: 'Verification fee amount' })
  @IsNumber()
  @Min(0)
  feeAmount: number;

  @ApiProperty({ description: 'Documents submitted for verification as JSON array', required: false })
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  documents?: Record<string, any>[];
}
