import {
  Body,
  Controller,
  Post,
  Request,
  Get,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, SigninDto } from './dto';
import { LocalAuthGuard } from './guards';
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiCreatedResponse({
    description: 'User registered successfully',
  })
  @ApiBody({
    type: SignupDto,
    examples: {
      value: {
        summary: 'dummy signup values',
        value: {
          email: 'user123@gmail.com',
          password: 'pass123',
          name: 'User123',
        },
      },
    },
  })
  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    const user = await this.authService.signup(dto);
    return user;
  }

  // /auth/signin
  @ApiOkResponse({
    description: 'User logged in successfully',
  })
  @ApiBody({
    type: SigninDto,
    examples: {
      value: {
        summary: 'dummy login',
        value: {
          email: 'user123@gmail.com',
          password: 'pass123',
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Req() req, @Body() dto: SigninDto) {
    const user = await this.authService.signin(dto);
    req.session.user = user;
    return user;
  }

  @ApiOkResponse({
    description: 'User logged out successfully',
    type: Object,
  })
  @Get('/logout')
  logout(@Request() req): any {
    req.session.destroy();
    return { msg: 'The user session has ended' };
  }
}
