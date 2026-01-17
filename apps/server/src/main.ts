import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';

import { AppModule } from './app.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { ResponseInterceptor } from './common/interceptors/response.interceptor.js';
import { seedPermissions } from './permission/permission.seed';
import { assignDefaultPermissions } from './permission/assign-permissions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors();

  await seedPermissions(dataSource);
  await assignDefaultPermissions(dataSource);

  await app.listen(3000);
}
bootstrap();
