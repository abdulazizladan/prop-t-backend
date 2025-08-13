import { DataSource } from 'typeorm';
import { User, UserRole } from '../../users/entities/user.entity';
import { Property, PropertyType, PropertyStatus } from '../../properties/entities/property.entity';
import { Agent } from '../../agents/entities/agent.entity';
import * as bcrypt from 'bcrypt';

export class InitialSeed {
  constructor(private dataSource: DataSource) {}

  async run() {
    console.log('🌱 Starting database seeding...');

    // Create admin user
    const adminUser = await this.createAdminUser();
    console.log('✅ Admin user created');

    // Create sample users
    const sampleUsers = await this.createSampleUsers();
    console.log('✅ Sample users created');

    // Create sample properties
    const sampleProperties = await this.createSampleProperties(sampleUsers);
    console.log('✅ Sample properties created');

    // Create sample agents
    const sampleAgents = await this.createSampleAgents(sampleUsers);
    console.log('✅ Sample agents created');

    console.log('🎉 Database seeding completed successfully!');
  }

  private async createAdminUser(): Promise<User> {
    const userRepository = this.dataSource.getRepository(User);
    
    let adminUser = await userRepository.findOne({
      where: { email: 'admin@prop-t.com' },
    });

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      adminUser = userRepository.create({
        email: 'admin@prop-t.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
        isEmailVerified: true,
        isActive: true,
      });

      await userRepository.save(adminUser);
    }

    return adminUser;
  }

  private async createSampleUsers(): Promise<User[]> {
    const userRepository = this.dataSource.getRepository(User);
    const users: User[] = [];

    const sampleUserData = [
      {
        email: 'john.doe@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.USER,
      },
      {
        email: 'jane.smith@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
        role: UserRole.USER,
      },
      {
        email: 'agent@realestate.com',
        password: 'password123',
        firstName: 'Mike',
        lastName: 'Johnson',
        role: UserRole.AGENT,
      },
    ];

    for (const userData of sampleUserData) {
      let user = await userRepository.findOne({
        where: { email: userData.email },
      });

      if (!user) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        user = userRepository.create({
          ...userData,
          password: hashedPassword,
          isEmailVerified: true,
          isActive: true,
        });

        await userRepository.save(user);
      }

      users.push(user);
    }

    return users;
  }

  private async createSampleProperties(users: User[]): Promise<Property[]> {
    const propertyRepository = this.dataSource.getRepository(Property);
    const properties: Property[] = [];

    const samplePropertyData = [
      {
        title: 'Beautiful Family Home',
        description: 'Spacious 4-bedroom family home with modern amenities',
        location: '123 Main Street, Downtown',
        price: 450000,
        type: PropertyType.HOUSE,
        status: PropertyStatus.AVAILABLE,
        images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
        features: { bedrooms: 4, bathrooms: 3, garage: 2, pool: true },
        specifications: { squareFeet: 2500, yearBuilt: 2018, lotSize: '0.5 acres' },
      },
      {
        title: 'Modern Downtown Apartment',
        description: 'Luxury 2-bedroom apartment in the heart of downtown',
        location: '456 Oak Avenue, Downtown',
        price: 280000,
        type: PropertyType.APARTMENT,
        status: PropertyStatus.AVAILABLE,
        images: ['https://example.com/image3.jpg'],
        features: { bedrooms: 2, bathrooms: 2, balcony: true, gym: true },
        specifications: { squareFeet: 1200, yearBuilt: 2020, floor: 15 },
      },
    ];

    for (const propertyData of samplePropertyData) {
      let property = await propertyRepository.findOne({
        where: { title: propertyData.title },
      });

      if (!property) {
        property = propertyRepository.create({
          ...propertyData,
          listerId: users[0].id, // Assign to first user
        });

        await propertyRepository.save(property);
      }

      properties.push(property);
    }

    return properties;
  }

  private async createSampleAgents(users: User[]): Promise<Agent[]> {
    const agentRepository = this.dataSource.getRepository(Agent);
    const agents: Agent[] = [];

    const agentUser = users.find(user => user.role === UserRole.AGENT);
    
    if (agentUser) {
      let agent = await agentRepository.findOne({
        where: { userId: agentUser.id },
      });

      if (!agent) {
        agent = agentRepository.create({
          userId: agentUser.id,
          agencyName: 'Johnson Real Estate',
          bio: 'Experienced real estate professional with over 10 years in the market',
          licenseNumber: 'RE123456',
          experienceYears: 10,
          specializations: ['Residential', 'Commercial', 'Luxury'],
          contactInfo: {
            phone: '+1-555-0123',
            website: 'www.johnsonrealestate.com',
            officeAddress: '789 Business Blvd, Downtown',
          },
          isVerified: true,
          isActive: true,
        });

        await agentRepository.save(agent);
      }

      agents.push(agent);
    }

    return agents;
  }
}
