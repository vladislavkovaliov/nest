import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateDtoUser, UserDto } from './dto';
import { User } from './types';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  private readonly usersService: UsersService;

  public constructor(usersService: UsersService) {
    this.usersService = usersService;
  }

  @ApiOperation({ summary: 'Create a new user.' })
  @ApiResponse({ status: 200, type: CreateDtoUser })
  @UseGuards(JwtAuthGuard)
  @Post('/')
  async login(@Body() createDtoUser: CreateDtoUser) {
    const newUser = await this.usersService.create({
      ...createDtoUser,
    } as User);

    return {
      data: {
        login: newUser.login,
      },
    };
  }

  @ApiOperation({ summary: 'Get a list of user.' })
  @ApiResponse({ status: 200, type: UserDto, isArray: true })
  @ApiImplicitQuery({ name: 'limit', required: false, type: Number })
  @ApiImplicitQuery({ name: 'skip', required: false, type: Number })
  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getAllUsers(@Query('skip') skip = 0, @Query('limit') limit = 10) {
    const users = (await this.usersService.findAll(skip, limit)).map(
      ({ login }) => ({ login }),
    );

    return {
      data: users,
      skip: Number(skip),
      limit: Number(limit),
    };
  }

  @ApiOperation({ summary: 'Get user info by login.' })
  @ApiResponse({ status: 200, type: UserDto })
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

  @ApiOperation({ summary: 'Delete user by login.' })
  @ApiResponse({ status: 200, type: UserDto })
  @UseGuards(JwtAuthGuard)
  @Delete(':login')
  async deleteUser(@Param('login') login: string) {
    if (!Boolean(login)) {
      throw new NotFoundException();
    }

    const foundedUser = await this.usersService.findOne(login);

    if (!Boolean(foundedUser)) {
      throw new NotFoundException();
    }

    const user = await this.usersService.remove(login);

    return {
      data: {
        login: user.login,
      },
    };
  }
}
