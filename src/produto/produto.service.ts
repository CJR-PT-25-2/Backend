import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { SUBCATEGORIAS } from './subcategorias';
import { Produto } from './entities/produto.entity';

export interface CreateProdutoWithNamesDto extends CreateProdutoDto {
  subcategoriaNome: string;
  categoriaPaiNome: string;
  imagem1_url?: string;
  imagem2_url?: string;
  imagem3_url?: string;
  imagem4_url?: string;
}

interface PaginationParams { //paginação dos produtos
  page?: number;
  limit?: number;
}

interface UpdateProdutoFilesDto extends UpdateProdutoDto {
  imagem1_url?: Express.Multer.File[];
  imagem2_url?: Express.Multer.File[];
  imagem3_url?: Express.Multer.File[];
  imagem4_url?: Express.Multer.File[];
}
const normalizeKey = (name: string) => name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '');
@Injectable()
export class ProdutoService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateProdutoWithNamesDto) {
    const lojaIdNumerico = Number(data.loja_id);
    const precoNumerico = Number(data.preco);
    const estoqueNumerico = Number(data.estoque);

    const loja = await this.prisma.loja.findUnique({
      where: { id: lojaIdNumerico },
    });

    if (!loja) {
      throw new NotFoundException(`Loja com ID ${data.loja_id} não encontrada.`);
    }
    const normalizeKey = (name: string) => name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '');
    const categoriaChave = normalizeKey(data.categoriaPaiNome) as keyof typeof SUBCATEGORIAS;
    const categoriasValidas = SUBCATEGORIAS[categoriaChave];
    if (!categoriasValidas || !Array.isArray(categoriasValidas) || !categoriasValidas.includes(data.subcategoriaNome)) {
      throw new BadRequestException("Subcategoria inválida para a categoria da loja.");
    }


    const subcategoria = await this.prisma.categoria.findFirst({
      where: {
        nome: data.subcategoriaNome,
        categoria_pai_id: { not: null }
      },
      select: { id: true, categoria_pai_id: true },
    });

    const categoriaPai = await this.prisma.categoria.findFirst({
      where: { nome: data.categoriaPaiNome, categoria_pai_id: null },
      select: { id: true },
    });


    if (!subcategoria || !categoriaPai) {
      throw new NotFoundException(`Uma das categorias (${data.subcategoriaNome} ou ${data.categoriaPaiNome}) não foi encontrada no banco de dados.`);
    }

    const produtoData: any = {
      nome: data.nome,
      descrição: data.descricao ?? null,

      preco: precoNumerico,
      estoque: estoqueNumerico,

      Imagems_produto_URL: data.imagem1_url ?? data.Imagems_produto_URL ?? null, imagem1_url: data.imagem1_url ?? null,
      imagem2_url: data.imagem2_url ?? null,
      imagem3_url: data.imagem3_url ?? null,
      imagem4_url: data.imagem4_url ?? null,

      Loja: { connect: { id: lojaIdNumerico } },
      Categoria: { connect: { id: subcategoria.id } },
      Categoria_pai: { connect: { id: categoriaPai.id } },
    };

    return this.prisma.produto.create({
      data: produtoData,
      include: {

        Categoria: {
          select: {
            nome: true
          }
        },

        Loja: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    });
  }

  async findByCategoriaPai(categoriaPaiId: number) {
    return this.prisma.produto.findMany({
      where: { categoria_id_pai: categoriaPaiId },
      select: {
        id: true,
        nome: true,
        preco: true,
        estoque: true,

        categoria_id: true,
        categoria_id_pai: true,

        Imagems_produto_URL: true,
        imagem1_url: true,
        imagem2_url: true,
        imagem3_url: true,
        imagem4_url: true,

        Loja: {
          select: { sticker_url: true },
        },

        Categoria: true,
        Categoria_pai: true
      },
    });
  }


  async findAll({ page = 1, limit = 20 }: PaginationParams) {
    const pagina = Math.max(1, Number(page));
    const limite = Math.max(1, Number(limit));
    const skip = (pagina - 1) * limite;

    const T_produtos = await this.prisma.produto.count();

    const produtosEncontrados = await this.prisma.produto.findMany({
      take: limite,
      skip: skip,

      include: {
        Loja: true,
        Categoria: true,
        Categoria_pai: true,
        imagens: true,
        avaliacoes: true,
      },
    });

    return {
      data: produtosEncontrados,
      meta: {
        totalItems: T_produtos,
        currentPage: pagina,
        itemsPorPage: limite,
        totalPages: Math.ceil(T_produtos / limite),
      }
    };
  }

  async findAllSemPaginacao() {
    return this.prisma.produto.findMany({
      include: {
        Loja: true,
      },
      orderBy: {
        id: "desc"
      }
    });
  }

  async buscarPorNome(nome: string) {
    return this.prisma.produto.findMany({
      where: {
        nome: {
          contains: nome,
          mode: "insensitive"
        }
      },
      include: {
        Loja: true,
        Categoria: true,
        Categoria_pai: true
      }
    });
  }


  async findOne(id: number) {
    const produto = await this.prisma.produto.findUnique({
      where: { id },
      include: {
        Loja: {
          select: {
            id: true,
            nome: true,
            donoId: true,
          },
        },
        Categoria: true,
        Categoria_pai: true,
        imagens: true,
        avaliacoes: true,
      },
    });

    if (!produto) throw new NotFoundException(`Produto com ID ${id} não encontrado.`);


    return produto;
  }

  async update(id: number, data: any, files: any) {
    const updateData: any = {};

    if (data.nome !== undefined) updateData.nome = data.nome;
    if (data.preco !== undefined) updateData.preco = Number(data.preco);
    if (data.estoque !== undefined) updateData.estoque = Number(data.estoque);
    if (data.descricao !== undefined) updateData.descrição = data.descricao;

    if (data.categoriaPai && data.subcategoria) {
      const categoriaPaiNome = data.categoriaPai;
      const subcategoriaNome = data.subcategoria;

      const categoriaPai = await this.prisma.categoria.findFirst({
        where: { nome: categoriaPaiNome, categoria_pai_id: null },
      });

      const subcategoria = await this.prisma.categoria.findFirst({
        where: { nome: subcategoriaNome, categoria_pai_id: categoriaPai?.id },
      });

      if (!categoriaPai || !subcategoria) {
        throw new BadRequestException("Categoria ou Subcategoria inválida.");
      }

      updateData.Categoria_pai = { connect: { id: categoriaPai.id } };
      updateData.Categoria = { connect: { id: subcategoria.id } };
    }

    const getUrl = (fileArray?: Express.Multer.File[]) =>
      fileArray?.[0] ? `/uploads/${fileArray[0].filename}` : undefined;

    const novasImagens = {
      imagem1_url: getUrl(files.imagem1),
      imagem2_url: getUrl(files.imagem2),
      imagem3_url: getUrl(files.imagem3),
      imagem4_url: getUrl(files.imagem4),
    };

    const remover = {
      img1: data.remove_imagem1 === "true",
      img2: data.remove_imagem2 === "true",
      img3: data.remove_imagem3 === "true",
      img4: data.remove_imagem4 === "true",
    };

    if (remover.img1) updateData.imagem1_url = null;
    else if (novasImagens.imagem1_url) updateData.imagem1_url = novasImagens.imagem1_url;

    if (remover.img2) updateData.imagem2_url = null;
    else if (novasImagens.imagem2_url) updateData.imagem2_url = novasImagens.imagem2_url;

    if (remover.img3) updateData.imagem3_url = null;
    else if (novasImagens.imagem3_url) updateData.imagem3_url = novasImagens.imagem3_url;

    if (remover.img4) updateData.imagem4_url = null;
    else if (novasImagens.imagem4_url) updateData.imagem4_url = novasImagens.imagem4_url;

    if (updateData.imagem1_url)
      updateData.Imagems_produto_URL = updateData.imagem1_url;

    if (data.loja_id)
      updateData.Loja = { connect: { id: Number(data.loja_id) } };

    return this.prisma.produto.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number) {
    try {
      return this.prisma.produto.delete({ where: { id } });
    } catch {
      throw new NotFoundException(`Produto ${id} não encontrado.`);
    }
  }
}