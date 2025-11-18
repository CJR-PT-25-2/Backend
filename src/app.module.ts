import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { prismaModule } from 'prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config'; // 1. Importe o ConfigModule
import { ProdutoModule } from './produto/produto.module';
import { LojaModule } from './loja/loja.module';
import { AvaliacaoLojaModule } from './avaliacao-loja/avaliacao-loja.module';
import { AvaliacaoProdutoModule } from './avaliacao-produto/avaliacao-produto.module';
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
    UserModule,
    prismaModule,
    AuthModule,
    ProdutoModule,
    LojaModule,
    AvaliacaoLojaModule,
    AvaliacaoProdutoModule,
    CategoriaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
