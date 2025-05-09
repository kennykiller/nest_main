import { PartialType } from '@nestjs/mapped-types';
import { CreateCatDTO } from './create-cat-dto';

export class PatchCatDTO extends PartialType(CreateCatDTO) {}
