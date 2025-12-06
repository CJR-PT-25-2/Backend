import { Test, TestingModule } from '@nestjs/testing';
import { AvaliacaoProdutoController } from './avaliacao-produto.controller';
import { AvaliacaoProdutoService } from './avaliacao-produto.service';

describe('AvaliacaoProdutoController', () => {
  let controller: AvaliacaoProdutoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvaliacaoProdutoController],
      providers: [AvaliacaoProdutoService],
    }).compile();

    controller = module.get<AvaliacaoProdutoController>(AvaliacaoProdutoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
