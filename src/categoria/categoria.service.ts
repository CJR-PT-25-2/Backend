import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriaService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoriaDto) {
    if (dto.categoria_pai_id) {
      const pai = await this.prisma.categoria.findUnique({
        where: { id: dto.categoria_pai_id },
      });

      if (!pai) throw new NotFoundException('Categoria pai não encontrada');
    }

    return this.prisma.categoria.create({
      data: {
        nome: dto.nome,
        categoria_pai_id: dto.categoria_pai_id ?? null,
      },
    });
  }

  findAll() {
    return this.prisma.categoria.findMany({
      include: {
        Categoria_pai: true,
        categoria: true, // subcategorias
        produtos: true,
      },
    });
  }

  async findOne(id: number) {
    const categoria = await this.prisma.categoria.findUnique({
      where: { id },
      include: {
        Categoria_pai: true,
        categoria: true, 
        produtos: true,
      },
    });

    if (!categoria) throw new NotFoundException('Categoria não encontrada');

    return categoria;
  }

  async update(id: number, dto: UpdateCategoriaDto) {
    await this.findOne(id);

    if (dto.categoria_pai_id) {
      const pai = await this.prisma.categoria.findUnique({
        where: { id: dto.categoria_pai_id },
      });

      if (!pai) throw new NotFoundException('Categoria pai não encontrada');
    }

    return this.prisma.categoria.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.categoria.delete({
      where: { id },
    });
  }
}
