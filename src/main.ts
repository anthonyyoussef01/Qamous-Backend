import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as serveStatic from 'serve-static';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/robots.txt', serveStatic('utils/robots.txt'));
  app.use('/sitemap.xml', serveStatic('utils/sitemap.xml'));
  await app.listen(3000);
}
bootstrap();
