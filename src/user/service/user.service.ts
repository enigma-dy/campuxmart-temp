import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  User,
  UserDocument,
  UserPermission,
  UserRole,
} from '../schema/user.schema';
import * as argon2 from 'argon2';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto) {
    try {
      const existing = await this.userModel.findOne({ email: dto.email });
      if (existing) throw new ConflictException('Email taken');

      const user = await this.userModel.create(dto);
      const { password, ...rest } = user.toObject();
      return rest;
    } catch (error) {
      throw new InternalServerErrorException('User creation failed');
    }
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    return this.userModel.find().select('-password').lean().exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).select('-password').exec();
  }
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password')
      .lean()
      .exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async delete(id: string): Promise<void> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async setLastLogin(userId: string): Promise<void> {
    await this.userModel
      .updateOne({ _id: userId }, { lastLogin: new Date() })
      .exec();
  }

  async changePassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await argon2.hash(newPassword);
    const result = await this.userModel
      .updateOne({ _id: userId }, { password: hashedPassword })
      .exec();

    if (result.matchedCount === 0) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  }

  async hasPermission(
    userId: string,
    permission: UserPermission,
  ): Promise<boolean> {
    const user = await this.userModel.findById(userId).exec();
    return user?.hasPermission(permission) ?? false;
  }

  async isAdmin(userId: string): Promise<boolean> {
    const user = await this.userModel.findById(userId).exec();
    return user?.isAdmin() ?? false;
  }

  async isSuperAdmin(userId: string): Promise<boolean> {
    const user = await this.userModel.findById(userId).exec();
    return user?.isSuperAdmin() ?? false;
  }

  async isVendor(userId: string): Promise<boolean> {
    const user = await this.userModel.findById(userId).exec();
    return user?.isVendor() ?? false;
  }
}
