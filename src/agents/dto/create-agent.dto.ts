import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsArray, IsObject, Min, Max } from 'class-validator';

export class CreateAgentDto {
  @ApiProperty({ description: 'Agency name', required: false })
  @IsOptional()
  @IsString()
  agencyName?: string;

  @ApiProperty({ description: 'Agent license number', required: false })
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiProperty({ description: 'Agent bio/description', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ description: 'Agent profile image URL', required: false })
  @IsOptional()
  @IsString()
  profileImage?: string;

  @ApiProperty({ description: 'Agent experience in years', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(50)
  experienceYears?: number;

  @ApiProperty({ description: 'Agent specializations as array of strings', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specializations?: string[];

  @ApiProperty({ description: 'Agent contact information as JSON object', required: false })
  @IsOptional()
  @IsObject()
  contactInfo?: Record<string, any>;
}
