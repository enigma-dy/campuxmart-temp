import { UserPermission, UserRole } from '../schema/user.schema';

export interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
    role: UserRole;
    permission: UserPermission[];
    [key: string]: any;
  };
}
