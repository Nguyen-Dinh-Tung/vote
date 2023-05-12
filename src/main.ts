import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded, json } from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { initializeTransactionalContext } from 'typeorm-transactional';
import * as admin from 'firebase-admin';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule, {
    abortOnError: true,
    cors: true,
  });
  app.init();

  admin.initializeApp({
    credential: admin.credential.cert({
      privateKey:
        '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCypp6dX2DCNvqj\nWpFR1JqzC9w+E2aGHn4SrOeE9TEW42Qph7E1hm8Xx3wpMY6peiLwT8PrxhCt1zfg\noOSlF3eMaTRe/TVAwnar9mCWBJrQOdfMOxBi+PE/G2jmFMmegWBxAv9CLnz3H9aV\n+6zJf+xAXncwEIWyMuFPemJ1u9OHWQulWqBk92pGQKOdVzBpaNvhu/zLd/t1OmmM\nAgxWUNlrIdZC7hfyM0I0upsecZXUMbutp9bxNaIHFHRweDgxZIk9xEXGkxqIsmFx\nnFGcQnvnKTixQ1TPYkOrN5e7FsfxRw3N1OfJc9asJ7k7Yktm8/2znwxIzTZbtRXV\n5pbrw5HFAgMBAAECggEABpXROXRTVP1hUkWrnyRS2oA4q1ocOJvloksY0qQWHeWe\nYtCDZflxXWNHTp5qx5D+ujR6gJWhtkK9ZsyPeQ1rJPQYz9qODLfOV4ripwz+5ueG\n7pqLwVYzUFPyky6Xev4CX9AQODCN/y7/gjJPfXL3cqz4wD8PqpCpEPyuJfBZPP8p\nwtO4tKFLpzyrCjfTCqetPFeQIV1DNdFjilkWsifz3d9qXMPpvjfZosZnKHTCp9Sv\npg8sWor+d2ZFkRV/VqF/Z8PbwdXx3a0oe4FU6vQRBKTvXdCW8eZNeel0DZfSko3C\nen5H5mpCwIsKM8CQ6KgTOIpN22GKI+sd0COgflbciQKBgQDb1MQAxILXASz5hSgZ\naSQ0NZc9wFGRWsARTLTANHhx/feUDX2KQq87zY8fGfsfWKIgpG2iuqPolMAys/6V\nfgU5Dx7+R28avgmt+e2hildbMtHy5kX2Acku1yK8yN0h61b4xaMHkffjA30CEEyg\nadCW6qUn0xefJxWOg8VKJKViyQKBgQDQC1ns0OkdFPwcBo3ahSjSlrtwtkdIvY6g\ncQqwl+89B6rvjvuPclxGV+fojAIzVxjd9RXP43NxL30xFmlS/yi79B8eCpPN0DhN\nPa7NSa//stX1yN/9IBIB+CVI1Vx4Ej+OojkX23vvH3TG0jMICNLFOD5IAAoMJjXZ\nytZxlHPZHQKBgASh3iN6AJvRPYZghPDMI2QqQO6fL9jVRbjXmfN255bXWDE5e4y/\nTPwAn+Ry4rTNZFU1wc2tCykqgUZQPqwdxLRoGioXjULOAFw3KQe/Z4nXb08kBRNj\nBD9Fb0j1HpvJXsLNP1s4ezXAbBDwEP1MXYXgmexV6WiEJVMkebLPRODpAoGBAM3k\nXgOjoQD6EqM9zUeU/xiiujBLBPM1PiEEnrq0Mr0oiH/69nU5jZ7EQqv/W/IpYV/Q\nvNx30nkSsYhSELxl749Lgzw85ZgLWJ0Aza03Huokt+E+AobFJW0zgtq45YGjNalY\nXL6Cpf26GNznjD+IU+eAyQqCl278pdC8EExpydj1AoGBAIar/kIDrFomHCXe6lZO\nTB10tUIZO5Xxztg3eq7ALkBA3NBmM/NqKhEw4kERTpevQFs1ZQWvVkiBINRXsvBn\nfegex7wcj+HBT75p9K7IA2CaEfnxFAfbz3mLnf/VrFZBQmCofzTTPO0Hzx5GDnOf\nhplkidYdbHXL2W0I1k2KMryV\n-----END PRIVATE KEY-----\n',
      clientEmail: 'firebase-adminsdk-9b6iv@fir-2c753.iam.gserviceaccount.com',
      projectId: 'fir-2c753',
    }),
  });
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('API CONTEST')
    .setDescription('The COONTEST API description')
    .setVersion('1.0')
    .addTag('Contest')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(4000, () => {
    console.log('FACK STARTED!');
  });
}
bootstrap();
