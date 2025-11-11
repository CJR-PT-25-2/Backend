import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const subcategory = await this.prisma.subcategoria.findUnique({
      where: { id: createProductDto.subcategoria_nome },
    });
    
    if (!subcategory) {
      throw new NotFoundException(
        `Subcategoria ${createProductDto.subcategoria_nome} não encontrada.`,
      );
    }

    const DatatoCreate = {
      ...createProductDto,
      subcategoria_nome: subcategory.nome,
    };

    const product = await this.prisma.produto.create({
      data: DatatoCreate,
    });

    return product;
  }

  async findAll() {
    return await this.prisma.produto.findMany({
      include: { subcategoria: true },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.produto.findUnique({
      where: { id },
      include: { subcategoria: true },
    });

    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try{
      return await this.prisma.produto.update({
        where: { id: id },
        data: { ...updateProductDto },
      });
    } catch (error) {
      throw new NotFoundException(
        `Não foi possível atualizar o produto com ID ${id}.`,
      );
    }
  }

  remove(id: number) {
    try {
      return this.prisma.produto.delete({
        where: { id: id },
      });
    } catch (error) {
      throw new NotFoundException(`Produto com o ID ${id} não encontrado.`);
    }
  }
}
