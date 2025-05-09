import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  ParseIntPipe,
  Delete,
  HttpCode,
  Patch,
  NotFoundException,
} from '@nestjs/common';
import { UpdateCatDTO } from './interfaces/update-cat-dto';
import { CreateCatDTO } from './interfaces/create-cat-dto';
import { CatsService } from './cats.service';
import { ICat } from './interfaces/basic-interfaces';
import { PatchCatDTO } from './interfaces/patch-cat-dto';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Get()
  getAll() {
    return this.catsService.getCats();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number): ICat {
    const cat = this.catsService.getOne(id);
    if (!cat) {
      throw new NotFoundException(`Cat with ID ${id} not found`);
    }
    return cat;
  }

  @HttpCode(201)
  @Post()
  create(@Body() newCat: CreateCatDTO) {
    const allCats = this.catsService.createCat(newCat);
    return { message: 'Cat created', data: allCats };
  }

  @Put(':id')
  updateOne(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateCatDTO) {
    const updatedCat = this.catsService.updateCat(id, body, false);
    if (!updatedCat) {
      throw new NotFoundException(`Cat with ID ${id} not found`);
    }
    return { message: 'Cat updated', data: updatedCat };
  }

  @Patch(':id')
  patchOne(@Param('id', ParseIntPipe) id: number, @Body() body: PatchCatDTO) {
    const updatedCat = this.catsService.updateCat(id, body, true);
    if (!updatedCat) {
      throw new NotFoundException(`Cat with ID ${id} not found`);
    }
    return { message: 'Cat updated', data: updatedCat };
  }

  @Delete(':id')
  deleteOne(@Param('id', ParseIntPipe) id: number) {
    const deleted = this.catsService.deleteCat(id);
    if (!deleted) {
      throw new NotFoundException(`Cat with ID ${id} not found`);
    }
    return { message: 'Cat deleted successfully' };
  }
}
