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
      categoriaId: data.categoriaId ,
      perfil_url: data.perfil_url ?? null,
      sticker_url: data.sticker_url ?? null,
      banner_url: data.banner_url ?? null,
    },
  });
}

async getSubcategorias(lojaId: number) {
      const loja = await this.prisma.loja.findUnique({
      where: { id: lojaId },
      include: { categoria: true },
    });

    if (!loja) throw new NotFoundException("Loja não encontrada.");

    const categoriaLojaNome = loja.categoria.nome;

        const categoriaPai = await this.prisma.categoria.findFirst({
      where: {
        nome: categoriaLojaNome,
        categoria_pai_id: null,
      },
      include: { categoria: true },     });

    if (!categoriaPai) return [];

        return categoriaPai.categoria.map((sub) => ({
      id: sub.id,
      nome: sub.nome,
    }));
  }

  async findAll() {
    return await this.prisma.loja.findMany({
      include: {
        produtos: true,
        avaliacoes: true,
        dono: true,
        categoria: true
      },
    });
  }

  async buscarLojaPorUsuario(donoId: number) {
    return await this.prisma.loja.findMany({
      where: { donoId: Number(donoId) },
      include: {
        categoria: true,
        produtos: {
            include: {
                Categoria: true,             }
        }
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
        categoria: true,       },
    });

    if (!loja) {
      throw new NotFoundException(`Loja com ID ${id} não encontrada.`);
    }   
    const categoriaNome = loja.categoria ? loja.categoria.nome : null;

    return {
      ...loja,
      categoriaNome: categoriaNome,
    };
}

    
      
          
 async update(id: number, data: any, files: any) {
  const loja = await this.prisma.loja.findUnique({ where: { id } });

  if (!loja) {
    throw new NotFoundException(`Loja com ID ${id} não encontrada.`);
  }

    const getUrl = (fileArray?: Express.Multer.File[]) => 
    fileArray?.[0] ? `/uploads/${fileArray[0].filename}` : undefined;

    
    const updateData: any = {
      nome: data.nome,
      descricao: data.descricao,

            categoriaId: data.categoriaId
        ? Number(data.categoriaId)
        : undefined,
      
            perfil_url: getUrl(files.fotoPerfil),
      
            sticker_url: getUrl(files.logoSticker), 
      
            banner_url: getUrl(files.banner),
  };
  
      if (data.removeFotoPerfil === 'true') updateData.perfil_url = null;
  if (data.removeLogoSticker === 'true') updateData.sticker_url = null;
  if (data.removeBanner === 'true') updateData.banner_url = null;


  return this.prisma.loja.update({
    where: { id },
    data: updateData,
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
