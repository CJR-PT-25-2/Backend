import { PartialType } from '@nestjs/mapped-types';
import { CreateLojaDto } from './create-loja.dto';

//export class UpdateLojaDto extends PartialType(CreateLojaDto) {}
export class UpdateLojaDto {
  nome?: string;
  descricao?: string;
  banner_url?: string;
}
