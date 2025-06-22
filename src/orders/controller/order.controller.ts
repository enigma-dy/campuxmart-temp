import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { OrderService } from '../service/order.service';
import { CreateOrderDto, UpdateOrderStatusDto } from '../dto/create-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    const order = await this.orderService.create(createOrderDto);
    return { message: 'Order created successfully', order };
  }

  @Get()
  async findAll() {
    return { data: await this.orderService.findAll() };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return { data: await this.orderService.findOne(id) };
  }

  @Get('/seller/:sellerId')
  async findBySeller(@Param('sellerId') sellerId: string) {
    return { data: await this.orderService.findBySeller(sellerId) };
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    const order = await this.orderService.updateStatus(id, dto);
    return { message: 'Order status updated', order };
  }
}
