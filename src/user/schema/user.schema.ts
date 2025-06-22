import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as argon2 from 'argon2';

export enum UserRole {
  ADMIN = 'admin',
  VENDOR = 'endor',
  CUSTOMER = 'customer',
  SUPER_ADMIN = 'uper_admin',
}

export enum UserPermission {
  MANAGE_USERS = 'anage_users',
  MANAGE_VENDORS = 'anage_vendors',
  MANAGE_PRODUCTS = 'anage_products',
  MANAGE_ORDERS = 'anage_orders',
  MANAGE_SETTINGS = 'anage_settings',
  VIEW_ANALYTICS = 'view_analytics',
  REGULAR = 'egular',
}

export interface UserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  hasPermission(permission: UserPermission): boolean;
  isSuperAdmin(): boolean;
  isAdmin(): boolean;
  isVendor(): boolean;
}

export type UserDocument = User & Document & UserMethods;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  fullname: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ lowercase: true, unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  bio?: string;

  @Prop()
  businessName?: string;

  @Prop()
  businessCategory?: string;

  @Prop()
  businessLocation?: string;

  @Prop({ default: false })
  verified: boolean;

  @Prop()
  otp?: string;

  @Prop()
  otpExpiry?: string;

  @Prop()
  img?: string;

  @Prop()
  phoneNumber?: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @Prop({
    type: [String],
    enum: UserPermission,
    default: [UserPermission.REGULAR],
  })
  permissions: UserPermission[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: null })
  lastLogin?: Date;

  @Prop()
  storeName?: string;

  @Prop()
  storeDescription?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await argon2.hash(this.password);
  next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return argon2.verify(this.password, candidatePassword);
};

UserSchema.methods.hasPermission = function (
  permission: UserPermission,
): boolean {
  return this.permissions.includes(permission);
};

UserSchema.methods.isSuperAdmin = function (): boolean {
  return this.role === UserRole.SUPER_ADMIN;
};

UserSchema.methods.isAdmin = function (): boolean {
  return [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(this.role);
};

UserSchema.methods.isVendor = function (): boolean {
  return this.role === UserRole.VENDOR;
};
