import { Test, TestingModule } from '@nestjs/testing';
import { AuthShareService } from './auth-share.service';

describe('AuthShareService', () => {
  let service: AuthShareService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthShareService],
    }).compile();

    service = module.get<AuthShareService>(AuthShareService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
