import { e2e, games } from '../../src/mocks/games';
import { GamesService } from '../../src/games/games.service';
import { Game } from '../../src/games/types';

export const e2eCreds = e2e;

export const config = {
  name: 'GamesController',
  createGame: {
    url: '/games',
    method: 'POST',
  },
  games: {
    url: '/games',
    method: 'GET',
  },
  deleteGame: {
    url: '/games',
    method: 'DELETE',
  },
};

export const gamesService: GamesService = {
  async create(game: Game) {
    const idx = games.push(game);

    return {
      id: idx,
      name: games[idx - 1].name,
    };
  },
  async findAll(skip, limit) {
    return games.slice(skip, limit);
  },
  async findOne(name) {
    return games.find((x) => x.name === name);
  },
  async remove(name) {
    const idx = games.findIndex((x) => x.name === name);
    const copied = { ...games[idx] };

    games.splice(idx, 1);

    return copied;
  },
};
