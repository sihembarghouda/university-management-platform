import { PartialType } from '@nestjs/mapped-types';
import { CreateSpecialiteDto } from './create-specialite.dto';

export class UpdateSpecialiteDto extends PartialType(CreateSpecialiteDto) {}
