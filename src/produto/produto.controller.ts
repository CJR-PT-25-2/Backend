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
  UploadedFile
} from '@nestjs/common';
import { multerConfig } from 'src/upload/upload.config';
import { FileInterceptor } from '@nestjs/platform-express'; 
import { ProdutoService } from './produto.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

@Controller('produto')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  // @Post()
  // create(@Body() dto: CreateProdutoDto) {
  //   return this.produtoService.create(dto);
  // }
  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateProdutoDto
  ) {
    const imagens = file ? `/uploads/${file.filename}` : undefined;

    return this.produtoService.create({
      ...body,
      Imagems_produto_URL: imagens,
    });
  }



  @Get()
  findAll() {
    return this.produtoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.produtoService.findOne(id);
  }

  @Get('categoria_pai/:id')
async findByCategoriaPai(@Param('id', ParseIntPipe) id: number) {
  return this.produtoService.findByCategoriaPai(id);
}

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProdutoDto,
  ) {
    return this.produtoService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.produtoService.remove(id);
  }
}
