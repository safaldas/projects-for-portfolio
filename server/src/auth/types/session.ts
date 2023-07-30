import { User } from '@prisma/client';
import { Request } from 'express';

export interface UserSession extends Request {
  user: {
    id: number;
    email: string;
  };
}
