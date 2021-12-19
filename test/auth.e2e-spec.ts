import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';

export const auth = {
  name: 'AuthController',
  login: {
    url: '/auth/login',
    method: 'POST',
  },
  profile: {
    url: '/auth/profile',
    method: 'GET',
  },
};

export const e2eCreds = {
  username: 'e2e',
  password: 'e2e',
};

describe(`${auth.name} (e2e)`, () => {
  let app: INestApplication;
  let token = null;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(e2eCreds);

    token = body.access_token;
  });

  afterEach(async () => {
    await app.close();
  });

  it(`${auth.login.url} (${auth.login.method})`, async () => {
    const { statusCode, body } = await request(app.getHttpServer())
      .post(auth.login.url)
      .send(e2eCreds);

    expect(statusCode).toEqual(200);
    expect(body).toHaveProperty('access_token');
    expect(body.access_token).not.toBeFalsy();
  });

  it(`${auth.profile.url} (${auth.profile.method})`, async () => {
    const { statusCode, body } = await request(app.getHttpServer())
      .get(auth.profile.url)
      .set({ Authorization: `Bearer ${token}` });

    expect(statusCode).toEqual(200);
    expect(body).toEqual({
      id: 2,
      login: 'e2e',
    });
  });
});
