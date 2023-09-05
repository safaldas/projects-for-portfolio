// https://github.com/notiz-dev/nestjs-prisma/blob/c68dce2fa41c83addb108e47f640032babaec722/lib/prisma-client-exception.filter.ts#L21
// copied from this project because prisma 5  support was not released this day when i wrote this
import {
  ArgumentsHost,
  Catch,
  ContextType,
  HttpException,
  HttpServer,
  HttpStatus,
} from '@nestjs/common';
import { APP_FILTER, BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { Prisma } from '@prisma/client';

export declare type GqlContextType = 'graphql' | ContextType;

export type ErrorCodesStatusMapping = {
  [key: string]: number;
};

/**
 * {@link PrismaClientExceptionFilter} catches {@link Prisma.PrismaClientKnownRequestError}  and {@link Prisma.PrismaClientValidationError} exceptions.
 */
@Catch(
  Prisma?.PrismaClientKnownRequestError,
  Prisma.PrismaClientValidationError,
)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  /**
   * default error codes mapping
   *
   * Error codes definition for Prisma Client (Query Engine)
   * @see https://www.prisma.io/docs/reference/api-reference/error-reference#prisma-client-query-engine
   */
  private errorCodesStatusMapping: ErrorCodesStatusMapping = {
    P2000: HttpStatus.BAD_REQUEST,
    P2002: HttpStatus.CONFLICT,
    P2025: HttpStatus.NOT_FOUND,
  };

  /**
   * @param applicationRef
   * @param errorCodesStatusMapping
   */
  constructor(
    applicationRef?: HttpServer,
    errorCodesStatusMapping: ErrorCodesStatusMapping | null = null,
  ) {
    super(applicationRef);

    // use custom error codes mapping (overwrite)
    //
    // @example:
    //
    //   const { httpAdapter } = app.get(HttpAdapterHost);
    //   app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter, {
    //     P2022: HttpStatus.BAD_REQUEST,
    //   }));
    //
    if (errorCodesStatusMapping) {
      this.errorCodesStatusMapping = Object.assign(
        this.errorCodesStatusMapping,
        errorCodesStatusMapping,
      );
    }
  }

  /**
   * @param exception
   * @param host
   * @returns
   */
  catch(
    exception:
      | Prisma.PrismaClientKnownRequestError
      | Prisma.PrismaClientValidationError,
    host: ArgumentsHost,
  ) {
    if (exception instanceof Prisma.PrismaClientValidationError) {
      // Handle Prisma validation errors here
      const statusCode = HttpStatus.BAD_REQUEST;
      const invalidArgument = this.extractValidationError(exception.message);

      return super.catch(
        new HttpException(
          { statusCode, message: `Invalid argument: '${invalidArgument}'` },
          statusCode,
        ),
        host,
      );
    } else return this.catchClientKnownRequestError(exception, host);
  }

  private catchClientKnownRequestError(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ) {
    const statusCode = this.errorCodesStatusMapping[exception.code];
    const message =
      `[${exception.code}]: ` + this.exceptionShortMessage(exception.message);

    if (host.getType() === 'http') {
      if (!Object.keys(this.errorCodesStatusMapping).includes(exception.code)) {
        return super.catch(exception, host);
      }

      return super.catch(
        new HttpException({ statusCode, message }, statusCode),
        host,
      );
    } else if (host.getType<GqlContextType>() === 'graphql') {
      // for graphql requests
      if (!Object.keys(this.errorCodesStatusMapping).includes(exception.code)) {
        return exception;
      }

      return new HttpException({ statusCode, message }, statusCode);
    }
  }

  private exceptionShortMessage(message: string): string {
    const shortMessage = message.substring(message.indexOf('→'));
    return shortMessage
      .substring(shortMessage.indexOf('\n'))
      .replace(/\n/g, '')
      .trim();
  }

  private extractValidationError(errorMessage: string): string | null {
    const regex = /Unknown argument `(\w+)`\./; // Regular expression to match the specific line
    const match = errorMessage.match(regex);

    if (match && match[1]) {
      return match[1]; // Extract the argument name
    }

    return null; // Return null if no match is found
  }
}

export function providePrismaClientExceptionFilter(
  errorCodesStatusMapping?: ErrorCodesStatusMapping,
) {
  return {
    provide: APP_FILTER,
    useFactory: ({ httpAdapter }: HttpAdapterHost) => {
      return new PrismaClientExceptionFilter(
        httpAdapter,
        errorCodesStatusMapping,
      );
    },
    inject: [HttpAdapterHost],
  };
}
