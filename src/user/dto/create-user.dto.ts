import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Preencha o campo E-mail' })
  @IsEmail({}, { message: 'Enderaço de E-mail inválido' })
  email: string;

  @IsNotEmpty({ message: 'Preencha o campo Nome' })
  @IsString({ message: 'Nome digitado inválido' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Preencha o campo Senha' })
  @MinLength(8, { message: 'A senha deve conter no mínimo 8 caracteres' })
  senha: string;

  @IsOptional()
  @IsUrl({}, { message: 'A foto fornecida deve ser uma URL válida' })
  foto__perfil_URL: string;
}
