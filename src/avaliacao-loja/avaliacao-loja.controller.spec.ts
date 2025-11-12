import { Test, TestingModule } from '@nestjs/testing';
import { AvaliacaoLojaController } from './avaliacao-loja.controller';
import { AvaliacaoLojaService } from './avaliacao-loja.service';

describe('AvaliacaoLojaController', () => {
  let controller: AvaliacaoLojaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvaliacaoLojaController],
      providers: [AvaliacaoLojaService],
    }).compile();

    controller = module.get<AvaliacaoLojaController>(AvaliacaoLojaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
