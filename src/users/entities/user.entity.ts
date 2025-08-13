import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Property } from '../../properties/entities/property.entity';
import { Agent } from '../../agents/entities/agent.entity';
import { VerificationRequest } from '../../verification/entities/verification-request.entity';

export enum UserRole {
  USER = 'user',
  AGENT = 'agent',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @ApiProperty({ description: 'Unique identifier for the user' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User email address' })
  @Column({ unique: true, nullable: false })
  email: string;

  @ApiProperty({ description: 'User password (hashed)' })
  @Column({ nullable: false })
  @Exclude()
  password: string;

  @ApiProperty({ description: 'User role in the system' })
  @Column({
    default: UserRole.USER,
  })
  role: UserRole;

  @ApiProperty({ description: 'User first name' })
  @Column({ nullable: true })
  firstName: string;

  @ApiProperty({ description: 'User last name' })
  @Column({ nullable: true })
  lastName: string;

  @ApiProperty({ description: 'User phone number' })
  @Column({ nullable: true })
  phone: string;

  @ApiProperty({ description: 'User profile details as JSON' })
  @Column({ type: 'json', nullable: true })
  profileDetails: Record<string, any>;

  @ApiProperty({ description: 'Whether the user account is active' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Whether the user email is verified' })
  @Column({ default: false })
  isEmailVerified: boolean;

  @ApiProperty({ description: 'Date when the user was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Date when the user was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Property, (property) => property.lister)
  properties: Property[];

  @OneToOne(() => Agent, (agent) => agent.user)
  agent: Agent;

  @OneToMany(() => VerificationRequest, (request) => request.user)
  verificationRequests: VerificationRequest[];
}
