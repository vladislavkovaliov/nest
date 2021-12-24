import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../../src/auth/auth.module';
import { config, e2eCreds } from './config';
import { UsersService } from '../../src/users/users.service';
import { usersService } from '../users/config';

describe(`${config.name} (e2e)`, () => {
  let app: INestApplication;
  let token = null;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
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

  it(`${config.login.url} (${config.login.method})
    should login and receive access token`, async () => {
    const { statusCode, body } = await request(app.getHttpServer())
      .post(config.login.url)
      .send(e2eCreds);

    expect(statusCode).toEqual(200);
    expect(body).toHaveProperty('access_token');
    expect(body.access_token).not.toBeFalsy();
  });

  it(`${config.profile.url} (${config.profile.method})
    should login and return profile data`, async () => {
    const { statusCode, body } = await request(app.getHttpServer())
      .get(config.profile.url)
      .set({ Authorization: `Bearer ${token}` });

    const expectedBody = {
      login: 'e2e',
    };

    expect(statusCode).toEqual(200);
    expect(body).toEqual({
      login: expectedBody.login,
    });
  });
});
