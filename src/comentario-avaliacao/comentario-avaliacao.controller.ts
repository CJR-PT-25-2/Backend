import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { ComentariosAvaliacaoService } from './comentario-avaliacao.service';
import { CreateComentarioAvaliacaoDto } from './dto/create-comentario-avaliacao.dto';
import { UpdateComentarioAvaliacaoDto } from './dto/update-comentario-avaliacao.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';


@Controller('comentarios')
export class ComentariosAvaliacaoController {
  constructor(private readonly service: ComentariosAvaliacaoService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createDto: CreateComentarioAvaliacaoDto, @Req() req: Request){
    const usuarioId = (req.user as { id: number }).id;
    return this.service.create(createDto, usuarioId);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateComentarioAvaliacaoDto,
    @Req() req: Request,
  ) {
    const usuarioId = (req.user as { id: number }).id;
    return this.service.update(id, updateDto, usuarioId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const usuarioId = (req.user as { id: number }).id;
    return this.service.remove(id, usuarioId);
  }
}
