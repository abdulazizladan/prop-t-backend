import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Prop-T documentation') // Set a title for your API documentation
    .setDescription('Backend services for Prop-T') // Provide a description for the API
    .setVersion('1.0') // Specify the version of the API
    .addTag('default') // Add a tag for grouping API endpoints (can be customized)
    .build();

  // Create the Swagger document based on the application and configuration
  const document = SwaggerModule.createDocument(app, config);

  // Set up the Swagger UI at a specified endpoint (e.g., http://localhost:3000/api)
  SwaggerModule.setup('api', app, document);


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
