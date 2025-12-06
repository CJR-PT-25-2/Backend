import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private prisma: PrismaService,
  ) {}

  async login(loginDto: LoginDto) {
    const usuario = await this.userService.findByEmail(loginDto.email);
    if (!usuario || !(await bcrypt.compare(loginDto.senha, usuario.senha))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: usuario.id, email: usuario.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const usuario = await this.userService.findByEmail(forgotPasswordDto.email);

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado com esse email');
    }

    // Gerar token aleatório
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Definir expiração de 1 hora
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Salvar token hasheado no banco
    await this.prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: expiresAt,
      },
    });

    // Construir link de reset
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    // Checar configuração mínima do SMTP antes de enviar
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      // Limpar token salvo se a configuração estiver incompleta
      await this.prisma.usuario.update({
        where: { id: usuario.id },
        data: {
          resetPasswordToken: null,
          resetPasswordExpires: null,
        },
      });

      throw new BadRequestException(
        'Configuração de email incompleta. Defina MAIL_USER e MAIL_PASS no arquivo .env',
      );
    }

    try {
      await this.mailerService.sendMail({
        to: usuario.email,
        subject: 'Recuperação de Senha - Stock IO',
        template: 'reset-password',
        context: {
          name: usuario.name || usuario.username,
          resetUrl: resetUrl,
          expiresIn: '1 hora',
        },
      });

      return {
        message: 'Email de recuperação enviado com sucesso',
        email: usuario.email,
      };
    } catch (error) {
      // Logar erro original para facilitar debug
      // eslint-disable-next-line no-console
      console.error('Erro ao enviar email de recuperação:', error);

      // Se falhar ao enviar email, limpar token
      await this.prisma.usuario.update({
        where: { id: usuario.id },
        data: {
          resetPasswordToken: null,
          resetPasswordExpires: null,
        },
      });

      throw new BadRequestException(
        'Erro ao enviar email de recuperação. Verifique as configurações SMTP e os logs do servidor.',
      );
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    // Validar se as senhas coincidem
    if (resetPasswordDto.novaSenha !== resetPasswordDto.confirmarSenha) {
      throw new BadRequestException('As senhas não coincidem');
    }

    // Hash do token fornecido
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetPasswordDto.resetPasswordToken)
      .digest('hex');

    // Procurar usuário com o token válido e não expirado
    const usuario = await this.prisma.usuario.findFirst({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: {
          gt: new Date(),
        },
      },
    });

    if (!usuario) {
      throw new BadRequestException(
        'Token inválido ou expirado. Solicite um novo email de recuperação.',
      );
    }

    // Hash da nova senha
    const salt = 10;
    const senhaHash = await bcrypt.hash(resetPasswordDto.novaSenha, salt);

    // Atualizar senha e limpar token
    await this.prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        senha: senhaHash,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return {
      message: 'Senha atualizada com sucesso',
      email: usuario.email,
    };
  }
}
