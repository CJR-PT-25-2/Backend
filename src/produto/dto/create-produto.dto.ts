import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProdutoDto {
  @IsNotEmpty({ message: 'Nome do produto é obrigatório.' })
  @IsString({ message: 'Nome inválido.' })
  nome: string;

  @IsOptional()
  @IsString({ message: 'Descrição inválida.' })
  descrição?: string;   

  @IsNotEmpty({ message: 'Preço do produto é obrigatório.' })
  @IsNumber({}, { message: 'Preço deve ser um número.' })
  preco: number;

  @IsNotEmpty({ message: 'Estoque é obrigatório.' })
  @IsNumber({}, { message: 'Estoque deve ser numérico.' })
  estoque: number;

  @IsNotEmpty({ message: 'ID da loja é obrigatório.' })
  @IsNumber({}, { message: 'ID da loja deve ser numérico.' })
  loja_id: number;

  @IsNotEmpty({ message: 'ID da categoria é obrigatório.' })
  @IsNumber({}, { message: 'ID da categoria deve ser numérico.' })
  categoria_id: number;
}
