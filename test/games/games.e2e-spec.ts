import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../../src/auth/auth.module';
import { config, e2eCreds } from './config';
import { GamesModule } from '../../src/games/games.module';
import { GamesService } from '../../src/games/games.service';
import { usersService } from '../users/config';
import { UsersService } from '../../src/users/users.service';

describe(`${config.name} (e2e)`, () => {
  let app: INestApplication;
  let token = null;
  let gamesService = new GamesService();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, GamesModule, UsersService],
    })
      .overrideProvider([GamesService, UsersService])
      .useValue([usersService])
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

  it(`${config.createGame.url} (${config.createGame.method})
    should create a new game`, async () => {
    const game = {
      name: 'new_game',
    };
    const { statusCode, body } = await request(app.getHttpServer())
      .post(config.createGame.url)
      .send(game)
      .set({ Authorization: `Bearer ${token}` });

    const expected = await gamesService.findOne(game.name);

    expect(statusCode).toEqual(201);
    expect(body).toHaveProperty('data', {
      name: expected.name,
    });
  });

  it(`${config.games.url} (${config.games.method})
    should return all games and skip/limit (default)`, async () => {
    const { statusCode, body } = await request(app.getHttpServer())
      .get(config.games.url)
      .set({ Authorization: `Bearer ${token}` });

    const defaultSkip = 0;
    const defaultLimit = 10;

    const expected = (
      await gamesService.findAll(defaultSkip, defaultLimit)
    ).map(({ name, price, likes, createdDate }) => ({ name, price, likes, createdDate }));

    expect(statusCode).toEqual(200);
    expect(body).toHaveProperty('data', expected);
    expect(body).toHaveProperty('skip', defaultSkip);
    expect(body).toHaveProperty('limit', defaultLimit);
  });

  it(`${config.games.url} (${config.games.method})
    should return all games and skip/limit`, async () => {
    const skip = 0;
    const limit = 5;
    const { statusCode, body } = await request(app.getHttpServer())
      .get(`${config.games.url}?skip=${skip}&limit=${limit}`)
      .set({ Authorization: `Bearer ${token}` });

    const expected = (await gamesService.findAll(skip, limit)).map(
      ({ name, price, likes, createdDate }) => ({ name, price, likes, createdDate })
    );

    expect(statusCode).toEqual(200);
    expect(body).toHaveProperty('data', expected);
    expect(body).toHaveProperty('skip', skip);
    expect(body).toHaveProperty('limit', limit);
  });

  it(`${config.games.url} (${config.games.method})
    should return game by name`, async () => {
    const name = 'Spider-Man';
    const { statusCode, body } = await request(app.getHttpServer())
      .get(`${config.games.url}/${name}`)
      .set({ Authorization: `Bearer ${token}` });

    const expected = await gamesService.findOne(name);

    expect(statusCode).toEqual(200);
    expect(body).toHaveProperty('data', {
      name: expected.name,
    });
  });

  it(`${config.deleteGame.url} (${config.deleteGame.method})
    should delete game by name`, async () => {
    const name = 'Spider-Man';
    const { statusCode, body } = await request(app.getHttpServer())
      .del(`${config.deleteGame.url}/${name}`)
      .set({ Authorization: `Bearer ${token}` });

    const expected = await gamesService.findOne(name);

    expect(expected).toBeFalsy();
    expect(statusCode).toEqual(200);
    expect(body).toHaveProperty('data', {
      name: name,
    });
  });

  it('asdasd', async () => {
    const { statusCode, body } = await request(app.getHttpServer())
      .get(`${config.games.url}?orderBy=createdDate&limit=2`)
      .set({ Authorization: `Bearer ${token}` });



    console.log(body.data.map(x => new Date(x.createdDate * 1000).toLocaleString("en-US", {timeZoneName: "short"})));



  });
});
