import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAvaliacaoProdutoDto } from './dto/create-avaliacao-produto.dto';
import { UpdateAvaliacaoProdutoDto } from './dto/update-avaliacao-produto.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AvaliacaoProdutoService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateAvaliacaoProdutoDto, usuarioId: number) {
    return this.prisma.avaliacao_produto.create({
      data: {
        ...createDto,
        usuario_id: usuarioId,
      },
      include: {
        Usuario: {
          select: { id: true, name: true, foto_perfil_URL: true },
        },
      },
    });
  }

  findAllByProduto(produtoId: number) {
    return this.prisma.avaliacao_produto.findMany({
      where: { produto_id: produtoId },
      include: {
        Usuario: {
          select: { id: true, name: true, foto_perfil_URL: true },
        },
      },
    });
  }

  async findOne(id: number) {
    const avaliacao = await this.prisma.avaliacao_produto.findUnique({
      where: { id },
      include: {
        
        Usuario: {
          select: { id: true, name: true, foto_perfil_URL: true },
        },
        
        
        Produto: {
          include: {
            Loja: true, 
          },
        },
        
        
        Comentarios: { 
          include: {
            Usuario: true, 
          },
          orderBy: {
            id: 'asc', 
          }
        }
      },
    });
    
    if (!avaliacao) {
      throw new NotFoundException('Avaliação não encontrada.');
    }
    
    return avaliacao;
  }

  async update(
    id: number,
    updateDto: UpdateAvaliacaoProdutoDto,
    usuarioId: number,
  ) {
    await this.verificarPropriedade(id, usuarioId);

    return this.prisma.avaliacao_produto.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: number, usuarioId: number) {
    await this.verificarPropriedade(id, usuarioId);

    return this.prisma.avaliacao_produto.delete({
      where: { id },
    });
  }

  private async verificarPropriedade(id: number, usuarioId: number) {
    const avaliacao = await this.prisma.avaliacao_produto.findUnique({
      where: { id },
    });

    if (!avaliacao) {
      throw new NotFoundException('Avaliação não encontrada.');
    }

    if (avaliacao.usuario_id !== usuarioId) {
      throw new ForbiddenException(
        'Você não tem permissão para modificar este recurso.',
      );
    }
  }

  findAll() {
    return this.prisma.avaliacao_produto.findMany();
  }
}
