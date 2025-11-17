import { 
  IsInt, 
  IsNotEmpty, 
  IsOptional, 
  IsString } from 'class-validator';

export class CreateCategoriaDto {
  @IsString({message:"Nome da Categoria"} )
  @IsNotEmpty()
  nome: string;

  @IsInt()
  @IsOptional()
  categoria_pai_id?: number;
}
