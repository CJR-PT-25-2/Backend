import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from "class-transformer";


export class CreateProdutoDto {
  @IsNotEmpty({ message: 'Nome do produto é obrigatório.' })
  @IsString({ message: 'Nome inválido.' })
  nome: string;

  @IsOptional()
  @IsString({ message: 'Descrição inválida.' })
  descricao?: string;   

  @Type(() => Number)
  @IsNumber()
  categoria_id: number;

  @Type(() => Number)
  @IsNumber()
  preco: number;

  @Type(() => Number)
  @IsNumber()
  estoque: number;

  @Type(() => Number)
  @IsNumber()
  loja_id: number;

  @IsString({ message: 'URL da imagem inválida.' })
  @IsOptional()
  Imagems_produto_URL?: string;
}
