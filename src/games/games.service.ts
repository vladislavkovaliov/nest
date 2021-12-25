import { Injectable } from '@nestjs/common';

import { Game } from './types';
import { games } from '../mocks/games';

@Injectable()
export class GamesService {
  async create(game: Game): Promise<Game | undefined> {
    const idx = games.push(game);

    return {
      id: idx,
      name: games[idx - 1].name,
    };
  }

  async findAll(skip: number, limit: number): Promise<Game[]> {
    return games.slice(skip, limit);
  }

  async findOne(name: string): Promise<Game | undefined> {
    return games.find((x) => x.name === name);
  }

  async remove(name: string): Promise<Game | undefined> {
    const idx = games.findIndex((x) => x.name === name);
    const copied = { ...games[idx] };

    games.splice(idx, 1);

    return copied;
  }
}
