import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {}

  async create(createPropertyDto: CreatePropertyDto, listerId: string): Promise<Property> {
    const property = this.propertyRepository.create({
      ...createPropertyDto,
      listerId,
    });

    return this.propertyRepository.save(property);
  }

  async findAll(query?: any): Promise<Property[]> {
    const queryBuilder = this.propertyRepository
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.lister', 'lister')
      .select(['property', 'lister.id', 'lister.firstName', 'lister.lastName']);

    // Add filters based on query parameters
    if (query.type) {
      queryBuilder.andWhere('property.type = :type', { type: query.type });
    }

    if (query.status) {
      queryBuilder.andWhere('property.status = :status', { status: query.status });
    }

    if (query.minPrice) {
      queryBuilder.andWhere('property.price >= :minPrice', { minPrice: query.minPrice });
    }

    if (query.maxPrice) {
      queryBuilder.andWhere('property.price <= :maxPrice', { maxPrice: query.maxPrice });
    }

    if (query.location) {
      queryBuilder.andWhere('property.location LIKE :location', { location: `%${query.location}%` });
    }

    // Add sorting
    if (query.sortBy) {
      const sortOrder = query.sortOrder === 'desc' ? 'DESC' : 'ASC';
      queryBuilder.orderBy(`property.${query.sortBy}`, sortOrder);
    } else {
      queryBuilder.orderBy('property.createdAt', 'DESC');
    }

    // Add pagination
    if (query.page && query.limit) {
      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.limit) || 10;
      const offset = (page - 1) * limit;
      queryBuilder.skip(offset).take(limit);
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Property> {
    const property = await this.propertyRepository.findOne({
      where: { id },
      relations: ['lister', 'verificationRequests'],
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    // Increment view count
    property.views += 1;
    await this.propertyRepository.save(property);

    return property;
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto, userId: string): Promise<Property> {
    const property = await this.findOne(id);

    // Check if user is the lister or an admin
    if (property.listerId !== userId) {
      throw new ForbiddenException('You can only update your own properties');
    }

    Object.assign(property, updatePropertyDto);
    return this.propertyRepository.save(property);
  }

  async remove(id: string, userId: string): Promise<void> {
    const property = await this.findOne(id);

    // Check if user is the lister or an admin
    if (property.listerId !== userId) {
      throw new ForbiddenException('You can only delete your own properties');
    }

    await this.propertyRepository.remove(property);
  }

  async findByLister(listerId: string): Promise<Property[]> {
    return this.propertyRepository.find({
      where: { listerId },
      order: { createdAt: 'DESC' },
    });
  }

  async findVerified(): Promise<Property[]> {
    return this.propertyRepository.find({
      where: { isVerified: true },
      relations: ['lister'],
      select: ['id', 'title', 'location', 'price', 'type', 'rating', 'views', 'createdAt'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateRating(id: string, rating: number): Promise<void> {
    const property = await this.findOne(id);
    
    const newRatingCount = property.ratingCount + 1;
    const newRating = ((property.rating * property.ratingCount) + rating) / newRatingCount;
    
    property.rating = parseFloat(newRating.toFixed(2));
    property.ratingCount = newRatingCount;
    
    await this.propertyRepository.save(property);
  }
}
