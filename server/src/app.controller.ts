import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

class defaultResponse {
  message: string;
}
@Controller()
export class AppController {
  @ApiOkResponse({
    description:
      'Returns a status message indicating the application is running',
    type: defaultResponse,
  })
  @Get('/')
  async start() {
    return { message: 'running' };
  }
}
