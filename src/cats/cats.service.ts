import { Injectable } from '@nestjs/common';
import { CreateCatDTO } from './interfaces/create-cat-dto';
import { UpdateCatDTO } from './interfaces/update-cat-dto';
import { ICat } from './interfaces/basic-interfaces';
import { PatchCatDTO } from './interfaces/patch-cat-dto';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class CatsService {
  private cats: ICat[] = [];

  constructor(private logService: LoggerService) {}

  getCats(): ICat[] {
    this.logService.log('get all cats');
    return this.cats;
  }

  getOne(id: number): ICat | null {
    const foundCat = this.cats.find((c) => c.id === id);
    if (!foundCat) {
      this.logService.error(`Cat with ID ${id} not found`);
      return null;
    }
    this.logService.log(`Returning cat #${id}`);
    return foundCat;
  }

  createCat(data: CreateCatDTO) {
    const id = this.cats.length + 1;
    this.cats.push({ ...data, id });

    this.logService.log(`Created new cat with ID ${id}`);

    return this.cats;
  }

  deleteCat(id: number): boolean {
    const foundIndex = this.cats.findIndex((c) => c.id === id);
    if (foundIndex === -1) {
      this.logService.error(`Cat with ID ${id} not found`);
      return false;
    }
    this.cats.splice(foundIndex, 1);

    this.logService.log(`Deleted cat with ID ${id}`);

    return true;
  }

  updateCat(
    id: number,
    data: UpdateCatDTO | PatchCatDTO,
    isPatch = false,
  ): ICat | null {
    const foundIndex = this.cats.findIndex((c) => c.id === id);

    if (foundIndex === -1) {
      this.logService.error(`Cat with ID ${id} not found`);
      return null;
    }
    this.cats[foundIndex] = isPatch
      ? { ...this.cats[foundIndex], ...data }
      : { ...(data as UpdateCatDTO), id };
    return this.cats[foundIndex];
  }
}
