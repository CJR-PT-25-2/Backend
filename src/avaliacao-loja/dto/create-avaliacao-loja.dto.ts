import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateAvaliacaoLojaDto {
  @IsInt()
  @IsNotEmpty()
  loja_id: number;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  nota: number;

  @IsString()
  @IsNotEmpty()
  comentario: string;
}
