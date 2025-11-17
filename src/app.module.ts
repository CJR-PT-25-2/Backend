import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { prismaModule } from 'prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config'; // 1. Importe o ConfigModule
import { AvaliacaoProdutoModule } from './avaliacao-produto/avaliacao-produto.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    prismaModule,
    AuthModule,
    AvaliacaoProdutoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
