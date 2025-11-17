import { Test, TestingModule } from '@nestjs/testing';
import { AvaliacaoLojaService } from './avaliacao-loja.service';

describe('AvaliacaoLojaService', () => {
  let service: AvaliacaoLojaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AvaliacaoLojaService],
    }).compile();

    service = module.get<AvaliacaoLojaService>(AvaliacaoLojaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
