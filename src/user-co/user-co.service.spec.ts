import { Test, TestingModule } from '@nestjs/testing';
import { UserCoService } from './user-co.service';

describe('UserCoService', () => {
  let service: UserCoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserCoService],
    }).compile();

    service = module.get<UserCoService>(UserCoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
