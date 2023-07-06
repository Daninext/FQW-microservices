import { MiddlewareConsumer, Module } from '@nestjs/common';
import { FormModule } from './forms/form.module';
import { TypeOrmConfigService } from './type.orm.config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthConfigService } from './auth.config.service';
import { AuthModule } from './auth/auth.module';
import { RedirectMiddleware } from './redirect-middleware.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    AuthModule.forRoot(AuthConfigService),
    FormModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [],
  exports: [TypeOrmModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RedirectMiddleware).forRoutes('*');
  }
}
