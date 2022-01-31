import { Injectable } from '@nestjs/common';

import { Game } from './types';
import { games } from '../mocks/games';
import { CreateGameDto } from './dto';

import { last, propEq, clone, compose, findIndex, sortBy, sort as sortR, slice, prop, ifElse, sortWith, ascend, descend } from 'ramda';

export type OrderBy = 'createdDate';

@Injectable()
export class GamesService {
  async create(game: CreateGameDto): Promise<Game | undefined> {
    const newGame = {
      ...game,
      'likes': [],
      'createdDate': Math.floor(Date.now() / 1000),
    } as Game;

    const idx = games.push(newGame);
    const l = last(games);

    return {
      id: idx,
      name: l.name,
      price: l.price,
      likes: l.likes,
      createdDate: l.createdDate,
    };
  }

  async findAll(skip: number, limit: number, orderBy?: OrderBy, sort: string = 'asc'): Promise<Game[]> {
    const sortFn = sort === 'asc' ? ascend : descend;
    const sorted = sortR(sortFn(prop(orderBy)), games);

    return sorted.slice(skip, limit);
  }

  async findOne(name: string): Promise<Game | undefined> {
    return games.find((x) => x.name === name);
  }

  async remove(name: string): Promise<Game | undefined> {
    const index = compose(
      findIndex(propEq('name', name)),
    )(games)
    const copied = clone(games[index]);

    games.splice(index, 1);

    return copied;
  }
}
