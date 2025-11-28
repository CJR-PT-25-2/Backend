import { Test, TestingModule } from '@nestjs/testing';
import { ComentariosAvaliacaoController } from './comentario-avaliacao.controller';
import { ComentariosAvaliacaoService } from './comentario-avaliacao.service';

describe('ComentariosAvaliacaoController', () => {
  let controller: ComentariosAvaliacaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComentariosAvaliacaoController],
      providers: [ComentariosAvaliacaoService],
    }).compile();

    controller = module.get<ComentariosAvaliacaoController>(ComentariosAvaliacaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
