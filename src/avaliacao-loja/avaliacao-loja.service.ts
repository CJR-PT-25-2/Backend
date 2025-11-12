import { Injectable } from '@nestjs/common';
import { CreateAvaliacaoLojaDto } from './dto/create-avaliacao-loja.dto';
import { UpdateAvaliacaoLojaDto } from './dto/update-avaliacao-loja.dto';

@Injectable()
export class AvaliacaoLojaService {
  create(createAvaliacaoLojaDto: CreateAvaliacaoLojaDto) {
    return 'This action adds a new avaliacaoLoja';
  }

  findAll() {
    return `This action returns all avaliacaoLoja`;
  }

  findOne(id: number) {
    return `This action returns a #${id} avaliacaoLoja`;
  }

  update(id: number, updateAvaliacaoLojaDto: UpdateAvaliacaoLojaDto) {
    return `This action updates a #${id} avaliacaoLoja`;
  }

  remove(id: number) {
    return `This action removes a #${id} avaliacaoLoja`;
  }
}
