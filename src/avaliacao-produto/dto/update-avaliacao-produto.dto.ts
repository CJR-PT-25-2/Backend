import { PartialType } from '@nestjs/mapped-types';
import { CreateAvaliacaoProdutoDto } from './create-avaliacao-produto.dto';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateAvaliacaoProdutoDto extends PartialType(
  CreateAvaliacaoProdutoDto,
) {
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  nota?: number;

  @IsString()
  @IsOptional()
  comentario?: string;

  produto_id: never;
}
