import { Injectable } from '@nestjs/common';
import { users } from '../mocks/users';

// This should be a real class/interface representing a user entity
export type User = {
  id: number;
  login: string;
  password: string;
};

@Injectable()
export class UsersService {
  async insert(user: User): Promise<User> {
    const idx = users.push(user);

    return {
      id: idx,
      login: users[idx - 1].login,
      password: users[idx - 1].password, // TODO: remove it
    };
  }

  async find(skip = 0, limit = 10): Promise<User[]> {
    return users.slice(skip, limit);
  }

  async findOne(login: string): Promise<User | undefined> {
    return users.find((user) => user.login === login);
  }
}
