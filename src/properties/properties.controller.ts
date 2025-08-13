import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property } from './entities/property.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new property listing' })
  @ApiResponse({ status: 201, description: 'Property created successfully', type: Property })
  create(@Body() createPropertyDto: CreatePropertyDto, @Request() req): Promise<Property> {
    return this.propertiesService.create(createPropertyDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all properties with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'List of properties', type: [Property] })
  @ApiQuery({ name: 'type', required: false, enum: ['house', 'apartment', 'condo', 'townhouse', 'land', 'commercial'] })
  @ApiQuery({ name: 'status', required: false, enum: ['available', 'sold', 'rented', 'pending'] })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'location', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query() query: any): Promise<Property[]> {
    return this.propertiesService.findAll(query);
  }

  @Get('verified')
  @ApiOperation({ summary: 'Get all verified properties' })
  @ApiResponse({ status: 200, description: 'List of verified properties', type: [Property] })
  findVerified(): Promise<Property[]> {
    return this.propertiesService.findVerified();
  }

  @Get('my-properties')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user properties' })
  @ApiResponse({ status: 200, description: 'List of user properties', type: [Property] })
  findMyProperties(@Request() req): Promise<Property[]> {
    return this.propertiesService.findByLister(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get property by ID' })
  @ApiResponse({ status: 200, description: 'Property found', type: Property })
  @ApiResponse({ status: 404, description: 'Property not found' })
  findOne(@Param('id') id: string): Promise<Property> {
    return this.propertiesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update property by ID' })
  @ApiResponse({ status: 200, description: 'Property updated successfully', type: Property })
  @ApiResponse({ status: 403, description: 'Forbidden - not your property' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @Request() req,
  ): Promise<Property> {
    return this.propertiesService.update(id, updatePropertyDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete property by ID' })
  @ApiResponse({ status: 200, description: 'Property deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your property' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  remove(@Param('id') id: string, @Request() req): Promise<void> {
    return this.propertiesService.remove(id, req.user.id);
  }
}
