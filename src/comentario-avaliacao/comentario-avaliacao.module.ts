import { Module } from '@nestjs/common';
import { ComentariosAvaliacaoController } from './comentario-avaliacao.controller';
import { ComentariosAvaliacaoService } from './comentario-avaliacao.service';
import { prismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [prismaModule],
  controllers: [ComentariosAvaliacaoController],
  providers: [ComentariosAvaliacaoService],
})
export class ComentariosAvaliacaoModule {}
