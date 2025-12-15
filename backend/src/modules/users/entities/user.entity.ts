import { Role, UserStatus } from '@prisma/client';

export class UserEntity {
  id: string;
  email: string;
  firstName: string;
  lastName:  string;
  phone?:  string;
  avatar?: string;
  role: Role;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}