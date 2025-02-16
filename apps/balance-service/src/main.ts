import { NestFactory } from '@nestjs/core';
import { BalanceModule } from './balance.module';

async function bootstrap() {
  const app = await NestFactory.create(BalanceModule);
  await app.listen(3000);
}
bootstrap();
