import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export const GetIdFromParams = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    const idParam = request['params'].id;
    if (!idParam || isNaN(+idParam)) {
      throw new BadRequestException('Invalid id parameter');
    } else return idParam;
  },
);
