import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateLojaDto } from './dto/create-loja.dto';
import { UpdateLojaDto } from './dto/update-loja.dto';

export interface CreateLojaWithFilesDto extends CreateLojaDto {
  perfil_url?: string;
  sticker_url?: string;
  banner_url?: string;
}

@Injectable()
export class LojaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateLojaWithFilesDto) {
  return await this.prisma.loja.create({
    data: {
      nome: data.nome,
      descricao: data.descricao,
      donoId: data.donoId,
      perfil_url: data.perfil_url ?? null,
      sticker_url: data.sticker_url ?? null,
      banner_url: data.banner_url ?? null,
    },
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

  async buscarLojaPorUsuario(donoId: number) {
    return await this.prisma.loja.findMany({
      where: { donoId: Number(donoId) },
      include: {
        produtos: true,
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

  // async update(id: number, updateLojaDto: UpdateLojaDto) {
  //   const exists = await this.prisma.loja.findUnique({ where: { id } });

  //   if (!exists) {
  //     throw new NotFoundException(`Loja com ID ${id} não encontrada.`);
  //   }

  //   return await this.prisma.loja.update({
  //     where: { id },
  //     data: updateLojaDto,
  //   });
  // }
  async update(id: number, data: any, files: any) {
  return this.prisma.loja.update({
    where: { id },
    data: {
      nome: data.nome,
      descricao: data.descricao,
      perfil_url: files.perfil ? "/uploads/" + files.perfil[0].filename : undefined,
      banner_url: files.banner ? "/uploads/" + files.banner[0].filename : undefined,
      sticker_url: files.sticker ? "/uploads/" + files.sticker[0].filename : undefined,
    },
  });
}


  async remove(id: number) {
    const exists = await this.prisma.loja.findUnique({ where: { id } });

    if (!exists) {
      throw new NotFoundException(`Loja com ID ${id} não encontrada.`);
    }

    return await this.prisma.loja.delete({ where: { id } });
  }
}
