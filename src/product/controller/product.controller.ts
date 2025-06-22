import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { UserRole } from 'src/user/schema/user.schema';
import { Roles } from 'src/decorators/role.decorator';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';
import { Public } from 'src/decorators/public.decorator';
import { AuthRequest } from 'src/user/dto/auth-request.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles(UserRole.VENDOR, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createProductDto: CreateProductDto,
    @Req() req: AuthRequest,
  ) {
    const userId = createProductDto.vendorId
      ? createProductDto.vendorId
      : req.user.sub;
    console.log(userId);
    return this.productService.create(createProductDto, userId);
  }

  @Public()
  @Get()
  async findAll() {
    return this.productService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  @Roles(UserRole.VENDOR, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: AuthRequest,
  ) {
    return this.productService.update(id, updateProductDto, req.user.id);
  }

  @Roles(UserRole.VENDOR, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string, @Req() req: AuthRequest) {
    await this.productService.delete(id, req.user.id);
  }

  @Public()
  @Get('vendor/:vendorId')
  async findByVendor(@Param('vendorId') vendorId: string) {
    return this.productService.findByVendor(vendorId);
  }
}
