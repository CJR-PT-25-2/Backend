import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateProdutoDto {
  @IsNotEmpty({ message: "Nome do produto é obrigatório." })
  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @Type(() => Number)
  @IsNumber({}, { message: "Categoria inválida." })
  categoria_id: number; 
  @Type(() => Number)
  @IsNumber({}, { message: "Preço inválido." })
  preco: number;

  @Type(() => Number)
  @IsNumber({}, { message: "Estoque inválido." })
  estoque: number;

  @Type(() => Number)
  @IsNumber({}, { message: "Loja inválida." })
  loja_id: number;

  @IsOptional()
  @IsString()
  Imagems_produto_URL?: string;
}
