import { Test, TestingModule } from '@nestjs/testing';
import { AuthShareController } from './auth-share.controller';
import { AuthShareService } from './auth-share.service';

describe('AuthShareController', () => {
  let controller: AuthShareController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthShareController],
      providers: [AuthShareService],
    }).compile();

    controller = module.get<AuthShareController>(AuthShareController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
