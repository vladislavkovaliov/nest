import { Game } from '../games/types';

export const e2e = {
  id: 0,
  username: 'e2e',
  password: 'e2e',
};

export const games: Game[] = [
  {
    id: 1,
    name: 'Spider-Man',
    price: 20.0,
    likes: [1,3,5,6,8,9],
    createdDate: 1623734418000,
  },
  {
    id: 2,
    name: 'God of War',
    price: 22.0,
    likes: [2,4,6,8,10],
    createdDate: 1628506900000,
  },
  {
    id: 3,
    name: 'The last of us',
    price: 23.0,
    likes: [2,7,3],
    createdDate: 1634149109000,
  },
  {
    id: 4,
    name: 'The last of us 2',
    price: 24.0,
    likes: [9,1,7],
    createdDate: 1642871725000,
  },
  {
    id: 5,
    name: 'Iron Man',
    price: 25.0,
    likes: [1,4,8,9],
    createdDate: 1618899955000,
  },
  {
    id: 6,
    name: 'The Witcher',
    price: 26.0,
    likes: [],
    createdDate: 1613852522000,
  },
  {
    id: 7,
    name: 'Mario',
    price: 27.0,
    likes: [],
    createdDate: 1621237708000,
  },
  {
    id: 8,
    name: 'Super Mario',
    price: 28.0,
    likes: [],
    createdDate: 1615945991000,
  },
  {
    id: 9,
    name: 'Super Mario 2',
    price: 29.0,
    likes: [],
    createdDate: 1643301247000,
  },
  {
    id: 10,
    name: 'UFC 3',
    price: 30.0,
    likes: [],
    createdDate: 1630317409000,
  },
];
