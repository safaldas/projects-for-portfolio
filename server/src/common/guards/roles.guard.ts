// roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true; // No permissions required, allow access
    }
    const user = context.switchToHttp().getRequest().user;
    // console.log({ user });
    if (!user) {
      return false;
    }
    return roles.some((permission) => user.role === permission);
  }
}
