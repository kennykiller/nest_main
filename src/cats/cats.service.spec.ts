import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from './cats.service';
import { UpdateCatDTO } from './interfaces/update-cat-dto';
import { PatchCatDTO } from './interfaces/patch-cat-dto';
import { LoggerService } from '../logger/logger.service';

type MockedLogger = jest.Mocked<LoggerService>;

const patchData: PatchCatDTO = { name: 'Keks' };
const updateData: UpdateCatDTO = { name: 'Keks', age: 10 };

describe('CatsService', () => {
  let catsService: CatsService;
  let loggerService: MockedLogger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatsService],
    })
      .useMocker(() => ({
        log: jest.fn(),
        error: jest.fn(),
      }))
      .compile();

    catsService = module.get<CatsService>(CatsService);
    loggerService = module.get(LoggerService) as MockedLogger;
  });

  describe('getCats', () => {
    it('should return an empty array initially and call log', () => {
      expect(catsService.getCats()).toEqual([]);
      expect(loggerService.log).toHaveBeenCalledWith('get all cats');
    });
  });

  describe('getOne', () => {
    it('should return null if cat not found and log error', () => {
      const catId = 9999999;
      const result = catsService.getOne(catId);
      expect(result).toBeNull();
      expect(loggerService.error).toHaveBeenCalledWith(
        `Cat with ID ${catId} not found`,
      );
    });

    it('should return the correct cat by ID and log message', () => {
      catsService.createCat({ name: 'Barsik', age: 5 });
      const result = catsService.getOne(1);

      expect(result).toEqual({ name: 'Barsik', age: 5, id: 1 });
      expect(loggerService.log).toHaveBeenCalledWith('Returning cat #1');
    });
  });

  describe('createCat', () => {
    it('should add a new cat with incrementing ID and log creation', () => {
      catsService.createCat({ name: 'Barsik', age: 5 });
      expect(catsService.getCats()).toEqual([
        { name: 'Barsik', age: 5, id: 1 },
      ]);
      expect(loggerService.log).toHaveBeenCalledWith(
        'Created new cat with ID 1',
      );
    });
  });

  describe('updateCat (PATCH)', () => {
    it('should patch a cat without overwriting other fields', () => {
      catsService.createCat({ name: 'Barsik', age: 5 });
      catsService.updateCat(1, patchData, true);

      const [updatedCat] = catsService.getCats();
      expect(updatedCat.name).toBe('Keks');
      expect(updatedCat.age).toBe(5);
      expect(updatedCat.id).toBe(1);
    });
  });

  describe('updateCat (PUT)', () => {
    it('should fully replace a cat data', () => {
      catsService.createCat({ name: 'Barsik', age: 5 });
      catsService.updateCat(1, updateData, false);

      const [updatedCat] = catsService.getCats();
      expect(updatedCat.name).toBe('Keks');
      expect(updatedCat.age).toBe(10);
      expect(updatedCat.id).toBe(1);
    });
  });

  describe('deleteCat', () => {
    it('should remove a cat and log deletion', () => {
      catsService.createCat({ name: 'Barsik', age: 5 });
      catsService.createCat({ name: 'Keks', age: 10 });

      catsService.deleteCat(1);
      expect(catsService.getCats()).toEqual([{ name: 'Keks', age: 10, id: 2 }]);
      expect(loggerService.log).toHaveBeenCalledWith('Deleted cat with ID 1');
    });

    it('should return false when deleting non-existent cat', () => {
      const catId = 9999999;
      const errorMessage = `Cat with ID ${catId} not found`;
      const result = catsService.deleteCat(catId);
      expect(result).toBe(false);
      expect(loggerService.error).toHaveBeenCalledWith(errorMessage);
    });
  });
});
