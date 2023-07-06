import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { json, urlencoded } from 'express';
import { middleware } from 'supertokens-node/framework/express';
import supertokens from 'supertokens-node';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Session from 'supertokens-node/recipe/session';
import Dashboard from 'supertokens-node/recipe/dashboard';
import { SupertokensExceptionFilter } from './auth/auth/auth.filter';

async function bootstrap() {
  supertokens.init({
    framework: 'express',
    supertokens: {
      connectionURI: process.env.CONNECTION_URI,
      apiKey: process.env.API_KEY,
    },
    appInfo: {
      appName: 'service-1',
      apiDomain: 'http://localhost:201',
      websiteDomain: 'http://localhost:201',
      apiBasePath: '/auth',
      websiteBasePath: '/auth',
    },
    recipeList: [EmailPassword.init(), Session.init(), Dashboard.init()],
  });

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(middleware());
  app.enableCors({
    origin: ['http://localhost:200'],
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('pug');
  app.use(cookieParser());
  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ extended: true, limit: '5mb' }));

  app.useGlobalFilters(new SupertokensExceptionFilter());
  if ('PORT' in process.env) {
    await app.listen(process.env.PORT);
  } else {
    await app.listen(3000);
  }
}
bootstrap();
