import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/module/user.module';
import { Product, ProductSchema } from '../schema/product.schema';
import { NotificationModule } from 'src/notification/notification.module';
import { ProductService } from '../service/product.service';
import { ProductController } from '../controller/product.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    UserModule,
    NotificationModule,
  ],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
