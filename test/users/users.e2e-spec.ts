import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../../src/auth/auth.module';
import { UsersModule } from '../../src/users/users.module';
import { config, e2eCreds, usersService } from './config';
import { UsersService } from '../../src/users/users.service';

describe(`${config.name} (e2e)`, () => {
  let app: INestApplication;
  let token = null;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, UsersModule],
    })
      .overrideProvider(UsersService)
      .useValue(usersService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    /**
     * Need to get access token due to
     * not having duplication code.
     */
    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(e2eCreds);

    token = body.access_token;
  });

  afterEach(async () => {
    await app.close();
  });

  it(`${config.createUser.url} (${config.createUser.method})
    should create a new user`, async () => {
    const user = {
      login: 'new_user',
      password: 'new_password',
    };
    const { statusCode, body } = await request(app.getHttpServer())
      .post(config.createUser.url)
      .send(user)
      .set({ Authorization: `Bearer ${token}` });

    const expectedUsers = await usersService.findOne(user.login);

    expect(statusCode).toEqual(201);
    expect(body).toHaveProperty('data', {
      login: expectedUsers.login,
    });
  });

  it(`${config.allUsers.url} (${config.allUsers.method})
    should return all users and skip/limit (default)`, async () => {
    const { statusCode, body } = await request(app.getHttpServer())
      .get(config.allUsers.url)
      .set({ Authorization: `Bearer ${token}` });

    const defaultSkip = 0;
    const defaultLimit = 10;

    const expectedUsers = (
      await usersService.find(defaultSkip, defaultLimit)
    ).map(({ login }) => ({ login }));

    expect(statusCode).toEqual(200);
    expect(body).toHaveProperty('data', expectedUsers);
    expect(body).toHaveProperty('skip', defaultSkip);
    expect(body).toHaveProperty('limit', defaultLimit);
  });

  it(`${config.allUsers.url} (${config.allUsers.method})
    should return all users and skip/limit`, async () => {
    const skip = 0;
    const limit = 5;
    const { statusCode, body } = await request(app.getHttpServer())
      .get(`${config.allUsers.url}?skip=${skip}&limit=${limit}`)
      .set({ Authorization: `Bearer ${token}` });

    const expectedUsers = (await usersService.find(skip, limit)).map(
      ({ login }) => ({ login }),
    );

    expect(statusCode).toEqual(200);
    expect(body).toHaveProperty('data', expectedUsers);
    expect(body).toHaveProperty('skip', skip);
    expect(body).toHaveProperty('limit', limit);
  });

  it(`${config.getUserByLogin.url} (${config.getUserByLogin.method})
    should return user by login`, async () => {
    const login = 'e2e';
    const { statusCode, body } = await request(app.getHttpServer())
      .get(`${config.getUserByLogin.url}/${login}`)
      .set({ Authorization: `Bearer ${token}` });

    const expectedUsers = await usersService.findOne(login);

    expect(statusCode).toEqual(200);
    expect(body).toHaveProperty('data', {
      login: expectedUsers.login,
    });
  });

  it(`${config.deleteUser.url} (${config.deleteUser.method})
    should delete user by login`, async () => {
    const login = 'e2e';
    const { statusCode, body } = await request(app.getHttpServer())
      .del(`${config.deleteUser.url}/${login}`)
      .set({ Authorization: `Bearer ${token}` });

    const expectedUsers = await usersService.findOne(login);

    expect(expectedUsers).toBeFalsy();
    expect(statusCode).toEqual(200);
    expect(body).toHaveProperty('data', {
      login: login,
    });
    console.log(await usersService.find(0, 22));
  });
});
