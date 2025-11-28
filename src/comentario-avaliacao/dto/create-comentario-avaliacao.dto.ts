import { IsInt, IsNotEmpty, IsOptional, IsString, } from "class-validator";

export class CreateComentarioAvaliacaoDto {
  @IsInt()
  @IsOptional()
  avaliacao_produto_id: number;

  @IsInt()
  @IsOptional()
  avaliacao_loja_id: number;

  @IsInt()
  @IsNotEmpty()
  usuario_id: number;

  @IsString()
  @IsNotEmpty()
  conteudo: string;
}   