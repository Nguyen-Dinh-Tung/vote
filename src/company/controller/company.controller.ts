import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Headers, Res } from '@nestjs/common/decorators';
import { Response } from 'express';
import { RolesCheck } from 'src/common/decorator/roles.guard';
import { Roles } from 'src/common/enum/role.enum';
import getUserByReq from 'src/common/func/getUserByHeaderReq';
import { UserByToken } from 'src/users/interceptor/TransformAccountHistoryActive.decorator';
import { UsersService } from 'src/users/services/users.service';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { CompanyService } from '../services/company.service';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService,
    private readonly usersService : UsersService
    ) {}

  @RolesCheck([Roles.admin , Roles.marketing])
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto , @UserByToken() userBytoken : string ,@Res() res : Response) {

    try{

      return this.companyService.create(createCompanyDto , userBytoken , res);

    }catch(e){

      if(e) console.log(e);
      
    }
  }

  @RolesCheck([...Object.values(Roles)])
  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @RolesCheck([...Object.values(Roles)])
  @Get(':id')
  findOne(@Param('id') id: string) {
    try{

      return this.companyService.findOne(id);

    }catch(e){

      if(e) console.log(e);
      
    }
  }

  @RolesCheck([Roles.admin , Roles.marketing])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto , @Headers() headers : any) {
    return this.companyService.update(id, updateCompanyDto , getUserByReq(headers));
  }

  @RolesCheck([Roles.admin , Roles.marketing])
  @Delete(':id')
  remove(@Param('id') id: string , @Headers() headers : any ) {
    return this.companyService.remove(id , getUserByReq(headers));
  }
}
