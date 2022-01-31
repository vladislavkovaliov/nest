import { e2e, games } from '../../src/mocks/games';
import { GamesService } from '../../src/games/games.service';
import { Game } from '../../src/games/types';
import { insert, last, lastIndexOf } from 'ramda';

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
//
// export const gamesService: GamesService = {
//   async create(game: Game) {
//     const newGame = {
//       ...game,
//       'likes': [],
//       'createdDate': Math.floor(Date.now() / 1000),
//     } as Game;
//
//
//     const arr = insert(-1, newGame, games);
//     const l = last(arr);
//     const idx = lastIndexOf(l, arr);
//
//
//     return {
//       id: idx,
//       name: l.name,
//       price: l.price,
//       likes: l.likes,
//       createdDate: l.createdDate,
//     };
//   },
//   async findAll(skip, limit) {
//     return games.slice(skip, limit);
//   },
//   async findOne(name) {
//     return games.find((x) => x.name === name);
//   },
//   async remove(name) {
//     const idx = games.findIndex((x) => x.name === name);
//     const copied = { ...games[idx] };
//
//     games.splice(idx, 1);
//
//     return copied;
//   },
// };
