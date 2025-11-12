import { Module } from '@nestjs/common';
import { AvaliacaoLojaService } from './avaliacao-loja.service';
import { AvaliacaoLojaController } from './avaliacao-loja.controller';

@Module({
  controllers: [AvaliacaoLojaController],
  providers: [AvaliacaoLojaService],
})
export class AvaliacaoLojaModule {}
