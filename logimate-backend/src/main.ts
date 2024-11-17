import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug'],
  });
  
  // Enable CORS for all origins during development
  app.enableCors({
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  });
  
  // Set global prefix
  app.setGlobalPrefix('api');
  
  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());
  
  // Global validation pipe with transformation
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    whitelist: true,
    forbidNonWhitelisted: true,
    errorHttpStatusCode: 422,
  }));

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  // Add startup message
  console.log('\x1b[32m%s\x1b[0m', `
🚀 Logimate Backend Server is running!
📡 Server: http://localhost:${port}
⭐ Environment: ${process.env.NODE_ENV || 'development'}
⏰ Started at: ${new Date().toLocaleString()}
  `);
}
bootstrap();
