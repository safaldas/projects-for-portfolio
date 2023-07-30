import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  HttpStatus,
  HttpCode,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { AuthenticatedGuard, LocalAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: AuthDto) {
    const user = await this.authService.signup(dto);
    return user;
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Req() req, @Body() dto: AuthDto) {
    const user = await this.authService.signin(dto);
    req.session.user = user;
    return user;
  }

  @Get('/logout')
  logout(@Request() req): any {
    req.session.destroy();
    return { msg: 'The user session has ended' };
  }
}
