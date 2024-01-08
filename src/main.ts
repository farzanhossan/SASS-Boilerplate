import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'body-parser';
import { useContainer } from 'class-validator';
import { join } from 'path';
import { AppModule } from './app/app.module';
import { ENV } from './env';
import { createLogger } from './logger';
import { setupSwagger } from './swagger';

const logger = new Logger();
const allowedOrigins = [
  'http://localhost:4201',
  'http://localhost:4200',
  'http://localhost:4010',
  'https://accounts-staging.visathing.com',
  'https://accounts-staging.visathing.com',
  'https://staging-vt-user.vercel.app',
];

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    },
    logger: ENV.isProduction ? createLogger() : ['error', 'warn', 'debug', 'log', 'verbose'],
  });

  app.useStaticAssets(join(process.cwd(), 'public'));
  app.setBaseViewsDir(join(process.cwd(), 'views'));
  // app.engine(
  //     'hbs',
  //     hbs({
  //       extname: 'hbs',
  //       defaultLayout: 'layout_main',
  //       layoutsDir: join(__dirname, '..', 'views', 'layouts'),
  //       partialsDir: join(__dirname, '..', 'views', 'partials'),
  //       helpers: { printName },
  //     }),
  //   );
  app.setViewEngine('hbs');

  app.use(urlencoded({ extended: true }));
  app.use(
    json({
      limit: '10mb',
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  useContainer(app.select(AppModule), {
    fallbackOnErrors: true,
  });

  app.setGlobalPrefix(ENV.api.API_PREFIX);

  //   setupSecurity(app);
  setupSwagger(app);

  await app.listen(ENV.port);
  logger.log(`🚀🚀🚀🚀 Application is running on: ${await app.getUrl()} 🚀🚀🚀🚀`);

  logger.log(`📖📖📖 Documentation is available on: ${await app.getUrl()}/docs 📖📖📖`);
}
bootstrap();
