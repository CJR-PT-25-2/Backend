import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  resetPasswordToken: string;

  @IsString()
  @MinLength(6)
  novaSenha: string;

  @IsString()
  @MinLength(6)
  confirmarSenha: string;
}
