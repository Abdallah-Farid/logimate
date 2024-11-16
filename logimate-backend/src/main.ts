import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
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

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
