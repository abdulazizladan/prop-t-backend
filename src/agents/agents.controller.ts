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
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { Agent } from './entities/agent.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('agents')
@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new agent profile' })
  @ApiResponse({ status: 201, description: 'Agent profile created successfully', type: Agent })
  @ApiResponse({ status: 409, description: 'User already has an agent profile' })
  create(@Body() createAgentDto: CreateAgentDto, @Request() req): Promise<Agent> {
    return this.agentsService.create(createAgentDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active agents' })
  @ApiResponse({ status: 200, description: 'List of all agents', type: [Agent] })
  findAll(): Promise<Agent[]> {
    return this.agentsService.findAll();
  }

  @Get('verified')
  @ApiOperation({ summary: 'Get all verified agents' })
  @ApiResponse({ status: 200, description: 'List of verified agents', type: [Agent] })
  findVerified(): Promise<Agent[]> {
    return this.agentsService.findVerified();
  }

  @Get('my-profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user agent profile' })
  @ApiResponse({ status: 200, description: 'Agent profile found', type: Agent })
  @ApiResponse({ status: 404, description: 'Agent profile not found' })
  async getMyProfile(@Request() req): Promise<Agent | null> {
    return this.agentsService.findByUserId(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get agent by ID' })
  @ApiResponse({ status: 200, description: 'Agent found', type: Agent })
  @ApiResponse({ status: 404, description: 'Agent not found' })
  findOne(@Param('id') id: string): Promise<Agent> {
    return this.agentsService.findOne(id);
  }

  @Patch('my-profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user agent profile' })
  @ApiResponse({ status: 200, description: 'Agent profile updated successfully', type: Agent })
  async updateMyProfile(
    @Body() updateAgentDto: Partial<CreateAgentDto>,
    @Request() req,
  ): Promise<Agent> {
    const agent = await this.agentsService.findByUserId(req.user.id);
    if (!agent) {
      throw new Error('Agent profile not found');
    }
    return this.agentsService.update(agent.id, updateAgentDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update agent by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'Agent updated successfully', type: Agent })
  @ApiResponse({ status: 404, description: 'Agent not found' })
  update(@Param('id') id: string, @Body() updateAgentDto: Partial<CreateAgentDto>): Promise<Agent> {
    return this.agentsService.update(id, updateAgentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete agent by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'Agent deleted successfully' })
  @ApiResponse({ status: 404, description: 'Agent not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.agentsService.remove(id);
  }
}
