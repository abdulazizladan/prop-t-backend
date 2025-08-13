import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from './entities/agent.entity';
import { CreateAgentDto } from './dto/create-agent.dto';

@Injectable()
export class AgentsService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
  ) {}

  async create(createAgentDto: CreateAgentDto, userId: string): Promise<Agent> {
    // Check if user already has an agent profile
    const existingAgent = await this.agentRepository.findOne({
      where: { userId },
    });

    if (existingAgent) {
      throw new ConflictException('User already has an agent profile');
    }

    const agent = this.agentRepository.create({
      ...createAgentDto,
      userId,
    });

    return this.agentRepository.save(agent);
  }

  async findAll(): Promise<Agent[]> {
    return this.agentRepository.find({
      relations: ['user'],
      select: ['id', 'agencyName', 'bio', 'profileImage', 'rating', 'ratingCount', 'experienceYears', 'specializations', 'isVerified', 'isActive'],
      where: { isActive: true },
      order: { rating: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Agent> {
    const agent = await this.agentRepository.findOne({
      where: { id },
      relations: ['user', 'properties'],
    });

    if (!agent) {
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }

    return agent;
  }

  async findByUserId(userId: string): Promise<Agent | null> {
    return this.agentRepository.findOne({
      where: { userId },
      relations: ['user', 'properties'],
    });
  }

  async update(id: string, updateAgentDto: Partial<CreateAgentDto>): Promise<Agent> {
    const agent = await this.findOne(id);
    Object.assign(agent, updateAgentDto);
    return this.agentRepository.save(agent);
  }

  async remove(id: string): Promise<void> {
    const agent = await this.findOne(id);
    await this.agentRepository.remove(agent);
  }

  async updateRating(id: string, rating: number): Promise<void> {
    const agent = await this.findOne(id);
    
    const newRatingCount = agent.ratingCount + 1;
    const newRating = ((agent.rating * agent.ratingCount) + rating) / newRatingCount;
    
    agent.rating = parseFloat(newRating.toFixed(2));
    agent.ratingCount = newRatingCount;
    
    await this.agentRepository.save(agent);
  }

  async findVerified(): Promise<Agent[]> {
    return this.agentRepository.find({
      where: { isVerified: true, isActive: true },
      relations: ['user'],
      select: ['id', 'agencyName', 'bio', 'profileImage', 'rating', 'ratingCount', 'experienceYears', 'specializations'],
      order: { rating: 'DESC' },
    });
  }
}
