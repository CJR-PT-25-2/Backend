import { IsInt, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';


export class CreateLojaDto {
  @IsNotEmpty({ message: 'Nome da Loja.' })
  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  categoriaId: number;

  @IsNotEmpty({ message: 'O donoId é obrigatório.' })
  @IsInt()
  @Type(() => Number)
  donoId: number;

  @IsOptional()
  @IsString()
  perfil_url?: string;

  @IsOptional()
  @IsString()
  sticker_url?: string;

  @IsOptional()
  @IsString()
  banner_url?: string;

}
