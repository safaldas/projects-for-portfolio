import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const IncludeQueryParams = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const paramValue = request.query[data];

    // Parse string value to boolean
    return paramValue === 'true';
  },
);
