import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  UploadedFiles
} from '@nestjs/common';
import { CreateLojaDto } from './dto/create-loja.dto';
import { UpdateLojaDto } from './dto/update-loja.dto';
import { multerConfig } from 'src/upload/upload.config';
import { FileFieldsInterceptor } from '@nestjs/platform-express'; 
import { CreateLojaWithFilesDto, LojaService } from './loja.service';

const uploadFields = [
  { name: 'fotoPerfil', maxCount: 1 },
  { name: 'logoSticker', maxCount: 1 },
  { name: 'banner', maxCount: 1 },
];

@Controller('loja')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class LojaController {
  constructor(private readonly lojaService: LojaService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor(uploadFields, multerConfig))
  create(
    @Body() createLojaDto: CreateLojaDto,
    @UploadedFiles()
    files: {
      fotoPerfil?: Express.Multer.File[];
      logoSticker?: Express.Multer.File[];
      banner?: Express.Multer.File[];
    },
  ) {
    const lojaData: CreateLojaWithFilesDto = {
      ...createLojaDto,
      donoId: Number(createLojaDto.donoId),
      categoriaId: Number(createLojaDto.categoriaId),
      
      perfil_url: files.fotoPerfil?.[0]
        ? `/uploads/${files.fotoPerfil[0].filename}`
        : undefined,

      sticker_url: files.logoSticker?.[0]
        ? `/uploads/${files.logoSticker[0].filename}`
        : undefined,

      banner_url: files.banner?.[0]
        ? `/uploads/${files.banner[0].filename}`
        : undefined,
    };

    return this.lojaService.create(lojaData);
  }

  @Get()
  findAll() {
    return this.lojaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lojaService.findOne(id);
  }

  @Get("usuario/:id")
  buscarLojaPorUsuario(@Param("id", ParseIntPipe) donoId: number) {
    return this.lojaService.buscarLojaPorUsuario(donoId);
  }

  @Get(':id/subcategorias')
  async getSubcategorias(@Param('id', ParseIntPipe) id: number) {
    return this.lojaService.getSubcategorias(id);
  }


  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
    { name: 'fotoPerfil', maxCount: 1 },     { name: 'logoSticker', maxCount: 1 },     { name: 'banner', maxCount: 1 },   ], multerConfig)
  )
  update(
    @Param('id',  ParseIntPipe) id: number,
        @UploadedFiles() files: { 
        fotoPerfil?: Express.Multer.File[]; 
        logoSticker?: Express.Multer.File[]; 
        banner?: Express.Multer.File[] 
    },
    @Body() body
  ) {
            return this.lojaService.update(id, body, files);
  }
  

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.lojaService.remove(id);
  }
}