import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AvaliacaoLojaService } from './avaliacao-loja.service';
import { CreateAvaliacaoLojaDto } from './dto/create-avaliacao-loja.dto';
import { UpdateAvaliacaoLojaDto } from './dto/update-avaliacao-loja.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

@Controller('avaliacao-loja')
export class AvaliacaoLojaController {
  constructor(private readonly avaliacaoLojaService: AvaliacaoLojaService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Body() createAvaliacaoLojaDto: CreateAvaliacaoLojaDto,
    @Req() req: Request,
  ) {
    const usuarioId = (req.user as { id: number }).id;
    return this.avaliacaoLojaService.create(createAvaliacaoLojaDto, usuarioId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAvaliacaoLojaDto: UpdateAvaliacaoLojaDto,
    @Req() req: Request,
  ) {
    const usuarioId = (req.user as { id: number }).id;
    return this.avaliacaoLojaService.update(
      id,
      updateAvaliacaoLojaDto,
      usuarioId,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const usuarioId = (req.user as { id: number }).id;
    return this.avaliacaoLojaService.remove(id, usuarioId);
  }

  @Get('loja/:lojaId')
  findAllByLoja(@Param('lojaId', ParseIntPipe) lojaId: number) {
    return this.avaliacaoLojaService.findAllByLoja(lojaId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.avaliacaoLojaService.findOne(id);
  }

  @Get()
  findAll() {
    return this.avaliacaoLojaService.findAll();
  }
}
