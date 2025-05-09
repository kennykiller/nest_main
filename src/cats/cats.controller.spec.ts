import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { LoggerService } from '../logger/logger.service';

describe('CatsController', () => {
  let controller: CatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [CatsService, LoggerService],
    }).compile();

    controller = module.get<CatsController>(CatsController);
  });

  it('cats controller should be defined', () => {
    expect(controller).toBeDefined();
  });
});
