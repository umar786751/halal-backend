import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Define the port from environment variables with a fallback
  const port = process.env.PORT || 4000;

  // Enable CORS for frontend requests
  app.enableCors();

  // Global validation for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.use(morgan('dev'));

  // Configure Swagger with Bearer Auth
  const config = new DocumentBuilder()
    .setTitle('HalalFood System API')
    .setDescription('API documentation for HalalFood system')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token', // Reference name for authentication
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start the application
  await app.listen(port);
  
  // Log the correct URLs
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📑 Swagger API docs available at http://localhost:${port}/api`);
}

bootstrap();