import { Test, TestingModule } from '@nestjs/testing';
import { SpecialiteController } from './specialite.controller';
import { SpecialiteService } from './specialite.service';

describe('SpecialiteController', () => {
  let controller: SpecialiteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecialiteController],
      providers: [SpecialiteService],
    }).compile();

    controller = module.get<SpecialiteController>(SpecialiteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
