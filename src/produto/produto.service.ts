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

    const categoriaEspec = await this.prisma.categoria.findUnique({
      where: { id: data.categoria_id },
      select: { id: true,categoria_pai_id:true },
    });

    if (!categoriaEspec) {
            throw new NotFoundException(
                `Categoria com ID ${data.categoria_id} não encontrada.`,
            );
        }
      
    if (!categoriaEspec.categoria_pai_id) {
            throw new NotFoundException(
                `A categoria ${data.categoria_id} não possui uma Categoria Pai definida (ID nulo).`,
            );
        }
    const produtoData: any = {
      nome: data.nome,
      preco: data.preco,
      Loja: { connect: { id: data.loja_id } },
      Categoria: {connect: { id: categoriaEspec.id }},
      descrição: data.descricao || null,
      estoque: data.estoque,
      Imagems_produto_URL: data.Imagems_produto_URL || null,  
      Categoria_pai: { connect: { id: categoriaEspec.categoria_pai_id } },
    };

    if (data.descricao !== undefined) {
      produtoData.descrição = data.descricao;
    }

    return await this.prisma.produto.create({
      data: produtoData,
    });
  }

  async findByCategoriaPai(categoriaPaiId: number) {
    return await this.prisma.produto.findMany({
        where: {
            categoria_id_pai: categoriaPaiId,
        },
        select: {
            id: true,
            nome: true,
            preco: true,
            estoque: true,
            Imagems_produto_URL: true, // Campo direto da URL
            Loja: {
                select: {
                    sticker_url: true, // Para o logo na caixinha
                },
            },
        },
    });
}

  async findAll() {
    return await this.prisma.produto.findMany({
      include: {
        Loja: true,
        imagens: true,
        avaliacoes: true,
        Categoria: true,
        Categoria_pai: true,
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
        Categoria: true,
        Categoria_pai: true,
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

      let categoria_pai_id_to_connect: number | undefined;
      let { categoria_id: Categoria_id } = data;

      if (Categoria_id) {
        const categoriaEspec = await this.prisma.categoria.findUnique({
            where: { id: Categoria_id },
            select: { categoria_pai_id: true }
        });

      if (!categoriaEspec || !categoriaEspec.categoria_pai_id) {
            // Se não encontrou a categoria ou ela não tem um pai (e o campo é obrigatório)
            throw new NotFoundException(
                `Categoria ${Categoria_id} inválida ou Categoria Pai não definida.`,
            );
        }
        categoria_pai_id_to_connect = categoriaEspec.categoria_pai_id;
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
