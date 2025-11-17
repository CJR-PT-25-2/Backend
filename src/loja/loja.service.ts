import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateLojaDto } from './dto/create-loja.dto';
import { UpdateLojaDto } from './dto/update-loja.dto';

@Injectable()
export class LojaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLojaDto: CreateLojaDto) {
    return await this.prisma.loja.create({
      data: { ...createLojaDto },
    });
  }

  async findAll() {
    return await this.prisma.loja.findMany({
      include: {
        produtos: true,
        avaliacoes: true,
        dono: true,
      },
    });
  }

  async findOne(id: number) {
    const loja = await this.prisma.loja.findUnique({
      where: { id },
      include: {
        produtos: true,
        avaliacoes: true,
        dono: true,
      },
    });

    if (!loja) {
      throw new NotFoundException(`Loja com ID ${id} não encontrada.`);
    }

    return loja;
  }

  async update(id: number, updateLojaDto: UpdateLojaDto) {
    const exists = await this.prisma.loja.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException(`Loja com ID ${id} não encontrada.`);
    }

    return await this.prisma.loja.update({
      where: { id },
      data: { ...updateLojaDto },
    });
  }

  async remove(id: number) {
    const exists = await this.prisma.loja.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException(`Loja com ID ${id} não encontrada.`);
    }

    return await this.prisma.loja.delete({
      where: { id },
    });
  }
}
