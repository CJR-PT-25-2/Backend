import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAvaliacaoLojaDto } from './dto/create-avaliacao-loja.dto';
import { UpdateAvaliacaoLojaDto } from './dto/update-avaliacao-loja.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AvaliacaoLojaService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateAvaliacaoLojaDto, usuarioId: number) {
    return this.prisma.avaliacao_loja.create({
      data: {
        ...createDto,
        usuario_id: usuarioId,
      },
      include: {
        Usuario: {
          select: { id: true, name: true, foto__perfil_URL: true },
        },
      },
    });
  }

  findAllByLoja(lojaId: number) {
    return this.prisma.avaliacao_loja.findMany({
      where: { loja_id: lojaId },
      include: {
        Usuario: {
          select: { id: true, name: true, foto__perfil_URL: true },
        },
      },
    });
  }

  async findOne(id: number) {
    const avaliacao = await this.prisma.avaliacao_loja.findUnique({
      where: { id },
    });
    if (!avaliacao) {
      throw new NotFoundException('Avaliação da loja não encontrada.');
    }
    return avaliacao;
  }

  async update(
    id: number,
    updateDto: UpdateAvaliacaoLojaDto,
    usuarioId: number,
  ) {
    await this.verificarPropriedade(id, usuarioId);

    return this.prisma.avaliacao_loja.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: number, usuarioId: number) {
    await this.verificarPropriedade(id, usuarioId);

    return this.prisma.avaliacao_loja.delete({
      where: { id },
    });
  }

  private async verificarPropriedade(id: number, usuarioId: number) {
    const avaliacao = await this.prisma.avaliacao_loja.findUnique({
      where: { id },
    });

    if (!avaliacao) {
      throw new NotFoundException('Avaliação da loja não encontrada.');
    }

    if (avaliacao.usuario_id !== usuarioId) {
      throw new ForbiddenException(
        'Você não tem permissão para modificar este recurso.',
      );
    }
  }

  findAll() {
    return this.prisma.avaliacao_loja.findMany();
  }
}
