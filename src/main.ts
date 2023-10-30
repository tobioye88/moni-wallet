import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Config
  const configService = app.get<ConfigService>(ConfigService);
  const PORT = configService.get<number>('port', 8008);
  const APP_NAME = configService.get<string>('APP_NAME', 'APP');
  const NODE_ENV = configService.get<string>('NODE_ENV', 'DEVELOPMENT');

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle(APP_NAME.toUpperCase())
    .setDescription('Api Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  // Global Filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global Pipes
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT, () =>
    console.log(`${APP_NAME} started on port ${PORT} ENV: ${NODE_ENV}`),
  );
}
bootstrap();
