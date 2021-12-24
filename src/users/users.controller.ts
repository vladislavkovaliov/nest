import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User, UsersService } from './users.service';
import { CreateDtoUser } from './dto';

@Controller('users')
export class UsersController {
  private readonly usersService: UsersService;

  public constructor(usersService: UsersService) {
    this.usersService = usersService;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async login(@Body() createDtoUser: CreateDtoUser) {
    const newUser = await this.usersService.insert({
      ...createDtoUser,
    } as User);

    return {
      data: {
        login: newUser.login,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getAllUsers(@Query('skip') skip = 0, @Query('limit') limit = 10) {
    const users = (await this.usersService.find(skip, limit)).map(
      ({ login }) => ({ login }),
    );

    return {
      data: users,
      skip: Number(skip),
      limit: Number(limit),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':login')
  async getUserByLogin(@Param('login') login: string) {
    if (!Boolean(login)) {
      throw new NotFoundException();
    }

    const user = await this.usersService.findOne(login);

    if (!Boolean(user)) {
      throw new NotFoundException();
    }

    return {
      data: { login: user.login },
    };
  }
}
