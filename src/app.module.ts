import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { prismaModule } from 'prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ProdutoModule } from './produto/produto.module';
import { LojaModule } from './loja/loja.module';
import { AvaliacaoLojaModule } from './avaliacao-loja/avaliacao-loja.module';
import { AvaliacaoProdutoModule } from './avaliacao-produto/avaliacao-produto.module';
import { ComentariosAvaliacaoModule } from './comentario-avaliacao/comentario-avaliacao.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CategoriaModule } from './categoria/categoria.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST || 'smtp.ethereal.email',
        port: parseInt(process.env.MAIL_PORT || '587'),
        secure: process.env.MAIL_SECURE === 'true' || false, // true para 465, false para outros portos
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: process.env.MAIL_FROM || 'noreply@stockio.com',
      },
      template: {
        dir: join(process.cwd(), 'src', 'auth', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    UserModule,
    prismaModule,
    AuthModule,
    ProdutoModule,
    LojaModule,
    AvaliacaoLojaModule,
    AvaliacaoProdutoModule,
    CategoriaModule,
    ComentariosAvaliacaoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
