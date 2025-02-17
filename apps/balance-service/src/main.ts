import { NestFactory } from '@nestjs/core';
import { BalanceModule } from './balance.module';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(BalanceModule);
  app.use(morgan('dev'));
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
