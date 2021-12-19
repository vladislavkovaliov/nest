import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = {
  id: number;
  login: string;
  password: string;
};

@Injectable()
export class UsersService {
  private readonly users = [
    {
      id: 1,
      login: 'admin',
      password: 'admin',
    },
    {
      id: 2,
      login: 'e2e',
      password: 'e2e',
    },
  ];

  async findOne(login: string): Promise<User | undefined> {
    return this.users.find((user) => user.login === login);
  }
}
