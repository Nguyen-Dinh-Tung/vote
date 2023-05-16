import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from '../services/company.service';
import { CompanyController } from '../controller/company.controller';
import { InheriTance } from 'src/common/class/inheritance';
describe('company test', () => {
  let controller: CompanyController;
  const mocCompanyServices = {};
  const mockInhertan = {};
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [CompanyService],
      imports: [],
    })
      .overrideFilter(CompanyService)
      .useValue(mocCompanyServices)
      .compile();
    controller = module.get<CompanyController>(CompanyController);
  });
  it('should controler', () => {
    expect(controller).toBeDefined();
  });
});
