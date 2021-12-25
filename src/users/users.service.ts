import { Injectable } from '@nestjs/common';
import { users } from '../mocks/users';
import { User } from './types';

@Injectable()
export class UsersService {
  async create(user: User): Promise<User> {
    const idx = users.push(user);

    return {
      id: idx,
      login: users[idx - 1].login,
      password: users[idx - 1].password, // TODO: remove it
    };
  }

  async findAll(skip = 0, limit = 10): Promise<User[]> {
    return users.slice(skip, limit);
  }

  async findOne(login: string): Promise<User | undefined> {
    return users.find((user) => user.login === login);
  }

  async remove(login: string): Promise<User | undefined> {
    const idx = users.findIndex((x) => x.login === login);

    const copiedUser = { ...users[idx] };

    users.splice(idx, 1);

    return copiedUser;
  }
}
