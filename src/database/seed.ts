import { DataSource } from 'typeorm';
import { InitialSeed } from './seeds/initial.seed';

async function seed() {
  // For development, use SQLite configuration
  const dataSource = new DataSource({
    type: 'sqlite',
    database: 'app/database.sqlite',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
    logging: true,
  });

  try {
    await dataSource.initialize();
    console.log('🔌 Database connection established');

    const seeder = new InitialSeed(dataSource);
    await seeder.run();

    await dataSource.destroy();
    console.log('🔌 Database connection closed');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
