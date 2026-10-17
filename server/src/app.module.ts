import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { LecturesModule } from './lectures/lectures.module';
import { CoursesModule } from './courses/courses.module';
import { StudentCoursesModule } from './student-courses/student-courses.module';
import { CourseProgressModule } from './course-progress/course-progress.module';
import { LectureProgressModule } from './lecture-progress/lecture-progress.module';
import { OrdersModule } from './orders/orders.module';
import { PaginationModule } from './common/pagination/pagination.module';
import { UploadsModule } from './uploads/uploads.module';
import { PaypalModule } from './paypal/paypal.module';
import configValidation from './config/config.validation';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './auth/guards/authentication.guard';
import { AccessTokenGuard } from './auth/guards/access-token.guard';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './auth/config/jwt.config';
import { RolesGuard } from './auth/guards/roles.guard';
// import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
// import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
// import Redis from 'ioredis';
import redisConfig from './config/redis.config';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${ENV ? `.env.${ENV}` : '.env'}`,
      validationSchema: configValidation,
      load: [databaseConfig, appConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        synchronize: configService.get<boolean>('database.synchronize'),
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.password'),
        autoLoadEntities: configService.get<boolean>(
          'database.autoLoadEntities',
        ),
        database: configService.get<string>('database.name'),
      }),
    }),
    // ThrottlerModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     storage: new ThrottlerStorageRedisService(
    //       new Redis({
    //         host: configService.get<string>('redis.host'),
    //         port: configService.get<number>('redis.port'),
    //         password: configService.get<string>('redis.password'),
    //         enableOfflineQueue: false,
    //       }),
    //     ),
    //     throttlers: [
    //       {
    //         name: 'short',
    //         ttl: seconds(1),
    //         limit: 5,
    //       },
    //       {
    //         name: 'medium',
    //         ttl: seconds(10),
    //         limit: 20,
    //       },
    //       {
    //         name: 'long',
    //         ttl: seconds(60),
    //         limit: 100,
    //       },
    //     ],
    //   }),
    // }),
    UsersModule,
    LecturesModule,
    CoursesModule,
    StudentCoursesModule,
    CourseProgressModule,
    LectureProgressModule,
    OrdersModule,
    PaginationModule,
    UploadsModule,
    PaypalModule,
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(redisConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AccessTokenGuard,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
})
export class AppModule {}
