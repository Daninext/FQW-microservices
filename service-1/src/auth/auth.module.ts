import {
  MiddlewareConsumer,
  Module,
  NestModule,
  DynamicModule,
  Type,
} from '@nestjs/common';
import { ConfigInjectionToken } from './config.interface';
import { SupertokensService } from './supertokens/supertokens.service';
import { AuthMiddleware } from './auth/auth.middleware';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AuthConfigService } from '../auth.config.service';

@Module({
  imports: [UserModule],
  providers: [UserService],
  exports: [],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }

  static forRoot(config: Type<AuthConfigService>): DynamicModule {
    const options = new config().createOptions();
    return {
      providers: [
        {
          useValue: options,
          provide: ConfigInjectionToken,
        },
        SupertokensService,
      ],
      exports: [],
      imports: [],
      module: AuthModule,
    };
  }
}
