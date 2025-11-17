import { Module } from '@nestjs/common';
import { AvaliacaoProdutoService } from './avaliacao-produto.service';
import { AvaliacaoProdutoController } from './avaliacao-produto.controller';
import { prismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [prismaModule],
  controllers: [AvaliacaoProdutoController],
  providers: [AvaliacaoProdutoService],
})
export class AvaliacaoProdutoModule {}
