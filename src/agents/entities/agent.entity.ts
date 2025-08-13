import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Property } from '../../properties/entities/property.entity';

@Entity('agents')
export class Agent {
  @ApiProperty({ description: 'Unique identifier for the agent' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'ID of the user associated with this agent' })
  @Column({ nullable: false })
  userId: string;

  @ApiProperty({ description: 'Agency name' })
  @Column({ nullable: true })
  agencyName: string;

  @ApiProperty({ description: 'Agent license number' })
  @Column({ nullable: true })
  licenseNumber: string;

  @ApiProperty({ description: 'Agent bio/description' })
  @Column({ type: 'text', nullable: true })
  bio: string;

  @ApiProperty({ description: 'Agent profile image' })
  @Column({ nullable: true })
  profileImage: string;

  @ApiProperty({ description: 'Agent average rating' })
  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @ApiProperty({ description: 'Number of ratings received' })
  @Column({ default: 0 })
  ratingCount: number;

  @ApiProperty({ description: 'Agent experience in years' })
  @Column({ type: 'int', nullable: true })
  experienceYears: number;

  @ApiProperty({ description: 'Agent specializations as JSON array' })
  @Column({ type: 'json', nullable: true })
  specializations: string[];

  @ApiProperty({ description: 'Agent contact information as JSON' })
  @Column({ type: 'json', nullable: true })
  contactInfo: Record<string, any>;

  @ApiProperty({ description: 'Whether the agent is verified' })
  @Column({ default: false })
  isVerified: boolean;

  @ApiProperty({ description: 'Whether the agent is active' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Date when the agent was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Date when the agent was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => User, (user) => user.agent)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Property, (property) => property.lister)
  properties: Property[];
}
