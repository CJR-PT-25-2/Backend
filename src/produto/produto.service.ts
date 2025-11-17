import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

@Injectable()
export class ProdutoService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProdutoDto) {
    const loja = await this.prisma.loja.findUnique({
      where: { id: data.loja_id },
    });

    if (!loja) {
      throw new NotFoundException(
        `Loja com ID ${data.loja_id} não encontrada.`,
      );
    }

    const produtoData: any = {
      nome: data.nome,
      preco: data.preco,
      Loja: { connect: { id: data.loja_id } },
    };

    if (data.descrição !== undefined) {
      produtoData.descrição = data.descrição;
    }

    return await this.prisma.produto.create({
      data: produtoData,
    });
  }

  async findAll() {
    return await this.prisma.produto.findMany({
      include: {
        Loja: true,
        imagens: true,
        avaliacoes: true,
      },
    });
  }

  async findOne(id: number) {
    const produto = await this.prisma.produto.findUnique({
      where: { id },
      include: {
        Loja: true,
        imagens: true,
        avaliacoes: true,
      },
    });

    if (!produto) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }

    return produto;
  }

  async update(id: number, data: UpdateProdutoDto) {
    try {
      const { loja_id, ...rest } = data;

      if (loja_id) {
        const loja = await this.prisma.loja.findUnique({
          where: { id: loja_id },
        });

        if (!loja) {
          throw new NotFoundException(`Loja com ID ${loja_id} não encontrada.`);
        }
      }

      const filtered = Object.fromEntries(
        Object.entries(rest).filter(([_, v]) => v !== undefined),
      ) as any;

      return await this.prisma.produto.update({
        where: { id },
        data: {
          ...filtered,
          Loja: loja_id ? { connect: { id: loja_id } } : undefined,
        },
      });
    } catch {
      throw new NotFoundException(
        `Não foi possível atualizar o produto com ID ${id}.`,
      );
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.produto.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(
        `Produto com ID ${id} não encontrado.`,
      );
    }
  }
}
