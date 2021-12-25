import { UsersService } from '../../src/users/users.service';
import { users, e2e } from '../../src/mocks/users';

export const config = {
  name: 'UsersController',
  createUser: {
    url: '/users',
    method: 'POST',
  },
  allUsers: {
    url: '/users',
    method: 'GET',
  },
  getUserByLogin: {
    url: '/users',
    method: 'GET',
  },
  deleteUser: {
    url: '/users',
    method: 'DELETE',
  },
};

export const e2eCreds = e2e;

export const usersService: UsersService = {
  async create(user) {
    const idx = users.push(user);
    return {
      id: idx,
      login: users[idx - 1].login,
      password: users[idx - 1].password, // TODO: remove it
    };
  },
  async findAll(skip, limit) {
    return users.slice(skip, limit);
  },
  async findOne(login) {
    return users.find((user) => user.login === login);
  },
  async remove(login) {
    const idx = users.findIndex((x) => x.login === login);

    const copiedUser = { ...users[idx] };

    users.splice(idx, 1);

    return copiedUser;
  },
};
