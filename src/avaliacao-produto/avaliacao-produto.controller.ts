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
import { AvaliacaoProdutoService } from './avaliacao-produto.service';
import { CreateAvaliacaoProdutoDto } from './dto/create-avaliacao-produto.dto';
import { UpdateAvaliacaoProdutoDto } from './dto/update-avaliacao-produto.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

@Controller('avaliacao-produto')
export class AvaliacaoProdutoController {
  constructor(
    private readonly avaliacaoProdutoService: AvaliacaoProdutoService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Body() createAvaliacaoProdutoDto: CreateAvaliacaoProdutoDto,
    @Req() req: Request,
  ) {
    const usuarioId = (req.user as { id: number }).id;
    return this.avaliacaoProdutoService.create(
      createAvaliacaoProdutoDto,
      usuarioId,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAvaliacaoProdutoDto: UpdateAvaliacaoProdutoDto,
    @Req() req: Request,
  ) {
    const usuarioId = (req.user as { id: number }).id;
    return this.avaliacaoProdutoService.update(
      id,
      updateAvaliacaoProdutoDto,
      usuarioId,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const usuarioId = (req.user as { id: number }).id;
    return this.avaliacaoProdutoService.remove(id, usuarioId);
  }

  @Get('produto/:produtoId')
  findAllByProduto(@Param('produtoId', ParseIntPipe) produtoId: number) {
    return this.avaliacaoProdutoService.findAllByProduto(produtoId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.avaliacaoProdutoService.findOne(id);
  }

  @Get()
  findAll() {
    return this.avaliacaoProdutoService.findAll();
  }
}
