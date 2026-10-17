import { Module } from '@nestjs/common';
import { PaypalController } from './paypal.controller';
import { PaypalService } from './providers/paypal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/orders/order.entity';
import { ConfigModule } from '@nestjs/config';
import paypalConfig from './config/paypal.config';
import { StudentCoursesModule } from 'src/student-courses/student-courses.module';

@Module({
  controllers: [PaypalController],
  providers: [PaypalService],
  imports: [
    TypeOrmModule.forFeature([Order]),
    ConfigModule.forFeature(paypalConfig),
    StudentCoursesModule,
  ],
})
export class PaypalModule {}
