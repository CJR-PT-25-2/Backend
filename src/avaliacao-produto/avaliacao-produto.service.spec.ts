import { Test, TestingModule } from '@nestjs/testing';
import { AvaliacaoProdutoService } from './avaliacao-produto.service';

describe('AvaliacaoProdutoService', () => {
  let service: AvaliacaoProdutoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AvaliacaoProdutoService],
    }).compile();

    service = module.get<AvaliacaoProdutoService>(AvaliacaoProdutoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
