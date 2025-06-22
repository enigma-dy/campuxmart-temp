import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MonnifyService } from '../service/monnify.service';
import { MonnifyController } from '../controller/monnify.controller';
import { OrderModule } from 'src/orders/module/order.module';
import { OrderService } from 'src/orders/service/order.service';

@Module({
  imports: [HttpModule, OrderModule],
  controllers: [MonnifyController],
  providers: [MonnifyService],

  exports: [MonnifyService],
})
export class MonnifyModule {}
