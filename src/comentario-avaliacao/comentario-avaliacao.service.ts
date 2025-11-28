import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateComentarioAvaliacaoDto } from './dto/create-comentario-avaliacao.dto';
import { UpdateComentarioAvaliacaoDto } from './dto/update-comentario-avaliacao.dto';

@Injectable()
export class ComentariosAvaliacaoService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateComentarioAvaliacaoDto, usuarioId: number) {
    return this.prisma.comentarios_avaliacao.create({
      data: {
        avaliacao_produto_id: createDto.avaliacao_produto_id,
        avaliacao_loja_id: createDto.avaliacao_loja_id,
        usuario_id: usuarioId,
        conteudo: createDto.conteudo,
      },
      include: {
        avaliacao_produto: true,
        avaliacao_loja: true,
        Usuario: true,
      },
    });
  }

  findAll() {
    return this.prisma.comentarios_avaliacao.findMany({
      include: {
        avaliacao_produto: true,
        avaliacao_loja: true,
        Usuario: true,
      },
    });
  }

  async findOne(id: number) {
    const comentario = await this.prisma.comentarios_avaliacao.findUnique({
      where: { id },
      include: {
        avaliacao_produto: true,
        avaliacao_loja: true,
        Usuario: true,
      },
    });

    if (!comentario) {
      throw new NotFoundException('Comentário não encontrado.');
    }

    return comentario;
  }

  async update(id: number, updateDto: UpdateComentarioAvaliacaoDto, usuarioId: number) {
    await this.verificarPropriedade(id, usuarioId);

    return this.prisma.comentarios_avaliacao.update({
      where: { id },
      data: {
        avaliacao_produto_id: updateDto.avaliacao_produto_id,
        avaliacao_loja_id: updateDto.avaliacao_loja_id,
        conteudo: updateDto.conteudo,
      },
      include: {
        avaliacao_produto: true,
        avaliacao_loja: true,
        Usuario: true,
      },
    });
  }

  async remove(id: number, usuarioId: number) {
    await this.verificarPropriedade(id, usuarioId);

    return this.prisma.comentarios_avaliacao.delete({
      where: { id },
    });
  }

  private async verificarPropriedade(id: number, usuarioId: number) {
    const comentario = await this.prisma.comentarios_avaliacao.findUnique({
      where: { id },
    });

    if (!comentario) {
      throw new NotFoundException('Comentário não encontrado.');
    }

    if (comentario.usuario_id !== usuarioId) {
      throw new ForbiddenException(
        'Você não tem permissão para modificar este recurso.',
      );
    }
  }
}
