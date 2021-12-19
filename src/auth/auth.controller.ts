import {
  Controller,
  Request,
  Post,
  UseGuards,
  HttpCode,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  private readonly authService: AuthService;

  public constructor(authService: AuthService) {
    this.authService = authService;
  }

  @UseGuards(AuthGuard('local'))
  @HttpCode(200)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
