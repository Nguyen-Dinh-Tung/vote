import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded, json } from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { initializeTransactionalContext } from 'typeorm-transactional';

async function bootstrap() {
  initializeTransactionalContext()
  const app = await NestFactory.create(AppModule , {
    abortOnError : true ,
    cors : true ,
  });
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  const config = new DocumentBuilder()
  .setTitle('API CONTEST')
  .setDescription('The COONTEST API description')
  .setVersion('1.0')
  .addTag('Contest')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(4000, () => {console.log("FACK STARTED!");
  });
}
bootstrap();