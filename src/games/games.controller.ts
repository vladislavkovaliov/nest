import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto, GameDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Game } from './types';
import { CreateDtoUser } from '../users/dto';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';

@ApiTags('games')
@ApiBearerAuth()
@Controller('games')
export class GamesController {
  private readonly gamesService: GamesService;

  public constructor(gamesService: GamesService) {
    this.gamesService = gamesService;
  }

  @ApiOperation({ summary: 'Create a new game.' })
  @ApiResponse({ status: 200, type: CreateDtoUser })
  @UseGuards(JwtAuthGuard)
  @Post('/')
  async create(@Body() createGameDto: CreateGameDto) {
    const newGame = await this.gamesService.create({
      ...createGameDto,
    } as Game);

    return {
      data: {
        name: newGame.name,
      },
    };
  }

  @ApiOperation({ summary: 'Get a list of games.' })
  @ApiResponse({ status: 200, type: GameDto, isArray: true })
  @ApiImplicitQuery({ name: 'limit', required: false, type: Number })
  @ApiImplicitQuery({ name: 'skip', required: false, type: Number })
  @UseGuards(JwtAuthGuard)
  @Get('/')
  async findAll(@Query('skip') skip = 0, @Query('limit') limit = 10) {
    const games = (await this.gamesService.findAll(skip, limit)).map(
      ({ name }) => ({ name }),
    );

    return {
      data: games,
      skip: Number(skip),
      limit: Number(limit),
    };
  }

  @ApiOperation({ summary: 'Get one game by name.' })
  @ApiResponse({ status: 200, type: GameDto })
  @UseGuards(JwtAuthGuard)
  @Get(':name')
  async findOne(@Param('name') name: string) {
    if (!Boolean(name)) {
      throw new NotFoundException();
    }

    const foundedGame = await this.gamesService.findOne(name);

    if (!Boolean(foundedGame)) {
      throw new NotFoundException();
    }

    return {
      data: {
        name: foundedGame.name,
      },
    };
  }

  @ApiOperation({ summary: 'Delete game by name.' })
  @ApiResponse({ status: 200, type: GameDto })
  @UseGuards(JwtAuthGuard)
  @Delete(':name')
  async remove(@Param('name') name: string) {
    if (!Boolean(name)) {
      throw new NotFoundException();
    }

    const foundedGame = await this.gamesService.findOne(name);

    if (!Boolean(foundedGame)) {
      throw new NotFoundException();
    }

    const deletedGame = await this.gamesService.remove(name);

    return {
      data: {
        name: deletedGame.name,
      },
    };
  }
}
