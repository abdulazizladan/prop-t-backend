import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional, IsArray, Min, IsObject } from 'class-validator';
import { PropertyType, PropertyStatus } from '../entities/property.entity';

export class CreatePropertyDto {
  @ApiProperty({ description: 'Property title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Property description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Property location/address' })
  @IsString()
  location: string;

  @ApiProperty({ description: 'Property price' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Property type', enum: PropertyType })
  @IsEnum(PropertyType)
  type: PropertyType;

  @ApiProperty({ description: 'Property status', enum: PropertyStatus, default: PropertyStatus.AVAILABLE })
  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;

  @ApiProperty({ description: 'Property images as array of URLs', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({ description: 'Property features as JSON object', required: false })
  @IsOptional()
  @IsObject()
  features?: Record<string, any>;

  @ApiProperty({ description: 'Property specifications as JSON object', required: false })
  @IsOptional()
  @IsObject()
  specifications?: Record<string, any>;
}
