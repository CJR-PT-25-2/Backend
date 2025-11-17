import { IsInt, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateLojaDto {
  @IsNotEmpty({ message: 'Nome da Loja.' })
  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsNotEmpty({ message: 'O donoId é obrigatório.' })
  @IsInt()
  donoId: number;

  @IsOptional()
  @IsUrl({}, { message: 'banner_url deve ser uma URL válida.' })
  banner_url?: string;

  @IsOptional()
  @IsUrl({}, { message: 'sticker_url deve ser uma URL válida.' })
  sticker_url?: string;
}
