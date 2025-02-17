import { NestFactory } from '@nestjs/core';
import { RateModule } from './rate.module';
import * as morgan from 'morgan';
async function bootstrap() {
  const app = await NestFactory.create(RateModule);
  app.use(morgan('dev'));
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
