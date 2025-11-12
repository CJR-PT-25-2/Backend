import { PartialType } from '@nestjs/mapped-types';
import { CreateAvaliacaoLojaDto } from './create-avaliacao-loja.dto';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateAvaliacaoLojaDto extends PartialType(
  CreateAvaliacaoLojaDto,
) {
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  nota?: number;

  @IsString()
  @IsOptional()
  comentario?: string;

  loja_id: never;
}
