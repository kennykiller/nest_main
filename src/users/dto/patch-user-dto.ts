import { PartialType } from '@nestjs/mapped-types';
import { UpdateUserDto } from './update-user-dto';

class BasePatchUserDto extends PartialType(UpdateUserDto) {}

export class PatchUserDto extends BasePatchUserDto {}
