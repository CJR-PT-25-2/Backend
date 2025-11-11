import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsUrl,
  IsArray,
  Min,
} from 'class-validator';

export class CreateProductDto {


  @IsArray({ message: 'Anexe as fotos do seu produto' })
  @IsUrl({}, { each: true, message: 'A foto fornecida deve ser uma URL válida'})
  @IsNotEmpty({ message: 'Adicione pelo menos uma foto do produto' })
  foto_produto_URL: string[];

  @IsNotEmpty({ message: 'Preencha o campo Nome do produto' })
  @IsString({ message: 'O nome do produto deve ser um texto válido' })
  name: string;

  @IsNotEmpty({ message: 'Selecione uma Subcategoria' })
  @IsString({ message: 'A Subcategoria deve ser um texto válido' }) 
  subcategoria_nome: string;

  @IsNotEmpty({ message: 'Preencha o campo Descrição do produto' })
  @IsString({ message: 'A descrição do produto deve ser um texto válido' })
  descricao: string;

  @IsNotEmpty({ message: 'Preencha o campo Preço do produto' })
  @IsNumber({}, { message: 'O preço deve ser um número válido' })
  @Min(0.01, { message: 'O preço deve ser maior que zero' }) 
  preco: number;
  
  @IsNotEmpty({ message: 'Preencha o campo de Quantidade' })
  @IsNumber({}, { message: 'A quantidade deve ser um número inteiro' })
  @Min(1, { message: 'A quantidade mínima deve ser 1' })
  quantidade: number;
}