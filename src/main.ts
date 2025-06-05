import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('CampuxMart')
    .setDescription(
      'API for managing users, products, reviews, notifications, and templates',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'JWT',
    )
    .addTag('auth', 'Authentication endpoints')
    .addTag('user', 'User management endpoints')
    .addTag('notifications', 'Notification sending endpoints')
    .addTag('templates', 'Template management endpoints')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.use(
    '/api-doc',
    apiReference({
      content: document,
      theme: 'purple',
      spec: {
        title: 'CampuxMart API Reference',
        description:
          'Interactive API documentation for the E-Commerce platform',
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
