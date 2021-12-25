import {
  Controller,
  Request,
  Post,
  UseGuards,
  HttpCode,
  Get, Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../users/types';

export class JWT {
  @ApiProperty({example: "qwe123" ,description: "JWT access token."  })
  access_token: string
}

export class Auth {
  @ApiProperty({example: "e2e" ,description: "Username."  })
  username: string;

  @ApiProperty({example: "e2e" ,description: "Password."  })
  password: string;
}

@ApiTags("auth")
@Controller('auth')
export class AuthController {
  private readonly authService: AuthService;

  public constructor(authService: AuthService) {
    this.authService = authService;
  }

  @ApiOperation({ summary: "AWT authorize user by login and password." })
  @ApiResponse({status: 200, type: JWT })
  @UseGuards(AuthGuard('local'))
  @HttpCode(200)
  @Post('/login')
  async login(@Body() auth: Auth) {
    return this.authService.login({
      login: auth.username,
      password: auth.password,
    } as User);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  @ApiBearerAuth()
  getProfile(@Request() req) {
    return {
      login: req.user.login,
    };
  }
}
