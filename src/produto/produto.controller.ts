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
  UploadedFiles, BadRequestException,
  Query
} from '@nestjs/common';
import { multerConfig } from 'src/upload/upload.config';
import { FileFieldsInterceptor } from '@nestjs/platform-express'; import { ProdutoService, CreateProdutoWithNamesDto } from './produto.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

const uploadFields = [
  { name: 'imagem1', maxCount: 1 },
  { name: 'imagem2', maxCount: 1 },
  { name: 'imagem3', maxCount: 1 },
  { name: 'imagem4', maxCount: 1 },
];
const updateProdutoFields = [
  { name: 'imagem1', maxCount: 1 },
  { name: 'imagem2', maxCount: 1 },
  { name: 'imagem3', maxCount: 1 },
  { name: 'imagem4', maxCount: 1 },
];
@Controller('produto')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) { }

  @Post()
  @UseInterceptors(FileFieldsInterceptor(uploadFields, multerConfig))
  async create(
    @UploadedFiles()
    files: {
      imagem1?: Express.Multer.File[];
      imagem2?: Express.Multer.File[];
      imagem3?: Express.Multer.File[];
      imagem4?: Express.Multer.File[];
    },
    @Body() body: CreateProdutoDto & { subcategoria: string; categoriaPai: string }
  ) {
    const getUrl = (fileArray?: Express.Multer.File[]) =>
      fileArray?.[0] ? `/uploads/${fileArray[0].filename}` : undefined;

    const urls = {
      imagem1_url: getUrl(files.imagem1),
      imagem2_url: getUrl(files.imagem2),
      imagem3_url: getUrl(files.imagem3),
      imagem4_url: getUrl(files.imagem4),
    };

    if (!body.subcategoria || !body.categoriaPai) {
      throw new BadRequestException("Os campos 'subcategoria' e 'categoriaPai' são obrigatórios.");
    }

    const createDto: CreateProdutoWithNamesDto = {
      ...body,

      subcategoriaNome: body.subcategoria,
      categoriaPaiNome: body.categoriaPai,

      ...urls,
      Imagems_produto_URL: urls.imagem1_url
    };

    delete (createDto as any).subcategoria;
    delete (createDto as any).categoriaPai;

    return this.produtoService.create(createDto);
  }


  @Get()
    findAll(
      @Query('page') page?: string,
      @Query('limit') limit?: string,
      @Query('search') search?: string,
      @Query('precoMaximo') precoMaximo?: string,
      @Query('sortType') sortType?: 'Nenhum' | 'Mais Recente' | 'Mais Antiga',
    ) {
      const paginationParams = {
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? parseInt(limit, 10) : 10,
        search: search || undefined,
        precoMaximo: precoMaximo ? Number(precoMaximo) : undefined,
        sortType: sortType || undefined,
      };

      return this.produtoService.findAll(paginationParams);
}


  @Get("search/:nome")
  buscarProduto(@Param("nome") nome: string) {
    return this.produtoService.buscarPorNome(nome);
  }


  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.produtoService.findOne(id);
  }

  @Get('categoria_pai/:id')
  async findByCategoriaPai(@Param('id', ParseIntPipe) id: number) {
    return this.produtoService.findByCategoriaPai(id);
  }

  @Get("all")
  async findAllSemPaginacao() {
    return this.produtoService.findAllSemPaginacao();
  }


  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor(updateProdutoFields, multerConfig))
  update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles()
    files: {
      imagem1?: Express.Multer.File[];
      imagem2?: Express.Multer.File[];
      imagem3?: Express.Multer.File[];
      imagem4?: Express.Multer.File[];
    },
    @Body() body: any,
  ) {
    return this.produtoService.update(id, body, files);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.produtoService.remove(id);
  }
}