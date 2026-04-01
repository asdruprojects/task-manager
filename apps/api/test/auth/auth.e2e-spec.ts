import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { Server } from 'node:http';
import request from 'supertest';
import { AuthController } from '../../src/modules/auth/auth.controller';
import { AuthService } from '../../src/modules/auth/auth.service';

describe('Auth endpoints (e2e)', () => {
  let app: INestApplication;
  let server: Server;

  const authService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
    server = app.getHttpServer() as Server;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/auth/register registra un usuario', async () => {
    authService.register.mockResolvedValue({
      message: 'Usuario registrado exitosamente',
      user: {
        id: 1,
        email: 'john@example.com',
        name: 'John',
        lastName: 'Doe',
      },
    });

    const response = await request(server)
      .post('/api/auth/register')
      .send({
        name: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password1@',
      })
      .expect(201);

    expect(response.body).toEqual({
      message: 'Usuario registrado exitosamente',
      user: {
        id: 1,
        email: 'john@example.com',
        name: 'John',
        lastName: 'Doe',
      },
    });

    expect(authService.register).toHaveBeenCalledWith({
      name: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'Password1@',
    });
  });

  it('POST /api/auth/register valida la contraseña', async () => {
    await request(server)
      .post('/api/auth/register')
      .send({
        name: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: '12345678',
      })
      .expect(400);

    expect(authService.register).not.toHaveBeenCalled();
  });

  it('POST /api/auth/login retorna token y usuario', async () => {
    authService.login.mockResolvedValue({
      accessToken: 'token-de-prueba',
      user: {
        id: 1,
        email: 'john@example.com',
        name: 'John',
        lastName: 'Doe',
      },
    });

    const response = await request(server)
      .post('/api/auth/login')
      .send({
        email: 'john@example.com',
        password: 'Password1@',
      })
      .expect(200);

    expect(response.body).toEqual({
      accessToken: 'token-de-prueba',
      user: {
        id: 1,
        email: 'john@example.com',
        name: 'John',
        lastName: 'Doe',
      },
    });

    expect(authService.login).toHaveBeenCalledWith({
      email: 'john@example.com',
      password: 'Password1@',
    });
  });
});
