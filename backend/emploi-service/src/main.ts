import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Emploi du Temps API')
    .setDescription('Microservice pour la gestion des emplois du temps')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = parseInt(process.env.PORT || process.env.APP_PORT || '3010', 10);
  await app.listen(port);
  console.log(`🚀 Emploi-service listening on port ${port}`);
  console.log(`📘 Swagger UI: http://localhost:${port}/api`);
}
bootstrap();