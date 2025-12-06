import { Module } from '@nestjs/common';
import { AvaliacaoLojaService } from './avaliacao-loja.service';
import { AvaliacaoLojaController } from './avaliacao-loja.controller';
import { prismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [prismaModule],
  controllers: [AvaliacaoLojaController],
  providers: [AvaliacaoLojaService],
})
export class AvaliacaoLojaModule {}
