import {
  CanActivate,
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { Server } from 'node:http';
import request from 'supertest';
import { JwtAuthGuard } from '../../src/common/guards/jwt-auth.guard';
import { TasksController } from '../../src/modules/tasks/tasks.controller';
import { TasksService } from '../../src/modules/tasks/tasks.service';

class TestJwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    request.user = { id: 1, email: 'john@example.com' };
    return true;
  }
}

describe('Tasks endpoints (e2e)', () => {
  let app: INestApplication;
  let server: Server;

  const tasksService = {
    findAll: jest.fn(),
    create: jest.fn(),
    toggle: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: tasksService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(TestJwtAuthGuard)
      .compile();

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

  it('GET /api/tasks lista tareas con paginación y búsqueda', async () => {
    tasksService.findAll.mockResolvedValue({
      count: 1,
      items: [
        {
          id: 1,
          title: 'Preparar demo',
          description: 'Presentación final',
          completed: false,
          active: true,
          userId: 1,
          createdAt: '2026-03-31T00:00:00.000Z',
          updatedAt: '2026-03-31T00:00:00.000Z',
        },
      ],
      pageInfo: {
        page: 2,
        perPage: 10,
        itemCount: 1,
        pageCount: 2,
        hasPreviousPage: true,
        hasNextPage: false,
      },
    });

    await request(server)
      .get('/api/tasks?page=2&perPage=10&status=pending&search=demo')
      .expect(200);

    expect(tasksService.findAll).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        page: 2,
        perPage: 10,
        status: 'pending',
        search: 'demo',
      }),
    );
  });

  it('POST /api/tasks crea una tarea', async () => {
    tasksService.create.mockResolvedValue({
      id: 1,
      title: 'Preparar demo',
      description: 'Presentación final',
      completed: false,
      active: true,
      userId: 1,
      createdAt: '2026-03-31T00:00:00.000Z',
      updatedAt: '2026-03-31T00:00:00.000Z',
    });

    const response = await request(server)
      .post('/api/tasks')
      .send({
        title: 'Preparar demo',
        description: 'Presentación final',
      })
      .expect(201);

    expect(response.body.title).toBe('Preparar demo');
    expect(tasksService.create).toHaveBeenCalledWith(1, {
      title: 'Preparar demo',
      description: 'Presentación final',
    });
  });

  it('POST /api/tasks valida el máximo del título', async () => {
    await request(server)
      .post('/api/tasks')
      .send({
        title: 'a'.repeat(256),
      })
      .expect(400);

    expect(tasksService.create).not.toHaveBeenCalled();
  });

  it('PUT /api/tasks/:id/toggle cambia el estado de la tarea', async () => {
    tasksService.toggle.mockResolvedValue({
      id: 1,
      title: 'Preparar demo',
      description: 'Presentación final',
      completed: true,
      active: true,
      userId: 1,
      createdAt: '2026-03-31T00:00:00.000Z',
      updatedAt: '2026-03-31T00:00:00.000Z',
    });

    const response = await request(server)
      .put('/api/tasks/1/toggle')
      .send({ completed: true })
      .expect(200);

    expect(response.body.completed).toBe(true);
    expect(tasksService.toggle).toHaveBeenCalledWith(1, 1, true);
  });
});
