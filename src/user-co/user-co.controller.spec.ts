import { Test, TestingModule } from '@nestjs/testing';
import { UserCoController } from './user-co.controller';
import { UserCoService } from './user-co.service';

describe('UserCoController', () => {
  let controller: UserCoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserCoController],
      providers: [UserCoService],
    }).compile();

    controller = module.get<UserCoController>(UserCoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
