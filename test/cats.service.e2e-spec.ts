import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

import { LoggerService } from '../src/logger/logger.service';
import { CatsModule } from '../src/cats/cats.module';
import { CatsService } from '../src/cats/cats.service';

describe('CatsController (E2E)', () => {
  let app: INestApplication;
  let catsService: CatsService;
  let loggerService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [CatsModule],
    })
      .overrideProvider(LoggerService)
      .useValue({
        log: jest.fn(),
        error: jest.fn(),
      })
      .compile();

    catsService = moduleRef.get<CatsService>(CatsService);
    loggerService = moduleRef.get(LoggerService);

    // Подменяем внутренний массив cats
    Object.defineProperty(catsService, 'cats', {
      value: [
        { id: 1, name: 'Whiskers', age: 3 },
        { id: 2, name: 'Mittens', age: 5 },
      ],
      configurable: false,
      writable: true,
    });

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /cats/:id', () => {
    it('should return 404 if cat not found', async () => {
      const catId = 999999;
      const errorMessage = `Cat with ID ${catId} not found`;
      const response = await request(app.getHttpServer()).get(`/cats/${catId}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe(errorMessage);
      expect(loggerService.error).toHaveBeenCalledWith(errorMessage);
    });

    it('should return the correct cat by ID', async () => {
      const response = await request(app.getHttpServer()).get('/cats/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: 1, name: 'Whiskers', age: 3 });
      expect(loggerService.log).toHaveBeenCalledWith('Returning cat #1');
    });
  });

  describe('GET /cats', () => {
    it('should return cats list', async () => {
      const response = await request(app.getHttpServer()).get(`/cats`);
      expect(response.body).toEqual([
        { id: 1, name: 'Whiskers', age: 3 },
        { id: 2, name: 'Mittens', age: 5 },
      ]);
      expect(response.status).toBe(200);
      expect(loggerService.log).toHaveBeenCalledWith('get all cats');
    });
  });

  describe('POST /cats', () => {
    it('should create a new cat with valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/cats')
        .send({ name: 'Barsik', age: 3 });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Cat created');
      expect(response.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'Barsik', age: 3 }),
        ]),
      );
    });
    test.each([
      [{ age: 5 }, 'name should not be empty'],
      [{ name: '', age: 5 }, 'name should not be empty'],
      [{ name: 'Fluffy', age: -1 }, 'age must be a positive number'],
      [{ name: 'Fluffy', age: 1.5 }, 'age must be an integer number'],
    ])(
      'POST /cats fails with invalid data: %o',
      async (payload, expectedMessage) => {
        const response = await request(app.getHttpServer())
          .post('/cats')
          .send(payload);
        expect(response.status).toBe(400);
        expect(response.body.message).toContain(expectedMessage);
      },
    );
  });

  describe('PUT /cats/:id', () => {
    it('should update cat with valid data', async () => {
      const response = await request(app.getHttpServer())
        .put('/cats/1')
        .send({ name: 'Tema', age: 1 });
      expect(response.status).toBe(200);
      expect(response.body.message).toEqual('Cat updated');
      expect(response.body.data).toEqual({ id: 1, name: 'Tema', age: 1 });
    });

    it('should return 404 if cat not found', async () => {
      const catId = 999999;
      const errorMessage = `Cat with ID ${catId} not found`;
      const response = await request(app.getHttpServer())
        .put(`/cats/${catId}`)
        .send({ name: 'Tema', age: 1 });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe(errorMessage);
      expect(loggerService.error).toHaveBeenCalledWith(errorMessage);
    });

    it('should return 400 if name is missing', async () => {
      const response = await request(app.getHttpServer())
        .put('/cats/1')
        .send({ age: 1 });
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('name should not be empty');
    });

    it('should return 400 if age is missing', async () => {
      const response = await request(app.getHttpServer())
        .put('/cats/1')
        .send({ name: 'Tema' });
      expect(response.status).toBe(400);
      expect(response.body.message).toEqual([
        'age must be a positive number',
        'age must be an integer number',
      ]);
    });

    it('should return 400 if age is decimal', async () => {
      const response = await request(app.getHttpServer())
        .put('/cats/1')
        .send({ age: 1.5, name: 'Tema' });
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('age must be an integer number');
    });

    it('should return 400 if age is negative number', async () => {
      const response = await request(app.getHttpServer())
        .put('/cats/1')
        .send({ age: -1, name: 'Tema' });
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('age must be a positive number');
    });

    it('should return 400 if age is not a number', async () => {
      const response = await request(app.getHttpServer())
        .put('/cats/1')
        .send({ age: 'one', name: 'Tema' });
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('age must be a positive number');
    });
  });

  describe('PATCH /cats/:id', () => {
    it('should update name of a cat', async () => {
      const response = await request(app.getHttpServer())
        .patch('/cats/1')
        .send({ name: 'Pony' });
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual({ id: 1, name: 'Pony', age: 3 });
    });
    it('should update age of a cat', async () => {
      const response = await request(app.getHttpServer())
        .patch('/cats/2')
        .send({ age: 4 });
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual({ id: 2, name: 'Mittens', age: 4 });
    });
    it('should return 404 if cat not found', async () => {
      const catId = 999999;
      const errorMessage = `Cat with ID ${catId} not found`;
      const response = await request(app.getHttpServer())
        .patch(`/cats/${catId}`)
        .send({ name: 'Tema', age: 1 });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe(errorMessage);
      expect(loggerService.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('DELETE /cats/:id', () => {
    it('should remove cat from list', async () => {
      const response = await request(app.getHttpServer()).delete('/cats/1');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Cat deleted successfully');
      expect(loggerService.log).toHaveBeenCalledWith('Deleted cat with ID 1');
    });
    it('should throw 404 if cat not found', async () => {
      const catId = 999999;
      const errorMessage = `Cat with ID ${catId} not found`;
      const response = await request(app.getHttpServer()).delete(
        `/cats/${catId}`,
      );
      expect(response.status).toBe(404);
      expect(response.body.message).toBe(errorMessage);
      expect(loggerService.error).toHaveBeenCalledWith(errorMessage);
    });
  });
});
