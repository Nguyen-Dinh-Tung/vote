import { ParseParamPipe } from './../../users/pipe/ParseParamPipe.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { Headers, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { Response } from 'express';
import { RolesCheck } from 'src/common/decorator/roles.guard';
import { Roles } from 'src/common/enum/role.enum';
import getUserByReq from 'src/common/func/getUserByHeaderReq';
import { UserByToken } from 'src/users/interceptor/TransformAccountHistoryActive.decorator';
import { UsersService } from 'src/users/services/users.service';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { CompanyService } from '../services/company.service';
import { ImagePipe } from 'src/users/pipe/Image.pipe';
import { ParserDataPipe } from 'src/users/pipe/ParserData.pipe';
import { ParserBooleanIsActive } from 'src/common/pipe/ParserBooleanIsActive.pipe';
import { IdUserInterceptor } from 'src/users/interceptor/IdUserInterceptor';
import { UcpCheck } from 'src/common/decorator/ucp.guard';
import { ROLE_UCP } from 'src/user-cp/contants/role.enum';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService,
    private readonly usersService : UsersService
    ) {}

  @RolesCheck([...Object.values(Roles)])
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto , 
  @UserByToken(new ImagePipe()) userBytoken : string ,
  @Res() res : Response , 
  @UploadedFile(new ImagePipe()) file? : Express.Multer.File) {
    
    try{

      return this.companyService.create(createCompanyDto , userBytoken , res , file);

    }catch(e){

      if(e) console.log(e);
      
    }
  }

  @RolesCheck([...Object.values(Roles)])
  @Get('/:page?')
  findAll(
    @Res() res: Response, 
    @IdUserInterceptor() idUser: any,
    @Param() param?: any ,
  @Query(new ParseParamPipe()) query? : any ,
  
  ) {
    try{

      let page = Number(param.page)
      if(page === undefined)
      page = 1 ;
      return this.companyService.findAll(
        page , 
        query.isActive , 
        query.search ,
        query.ucp ,
        res ,
        idUser);

    }catch(e){

      if(e) console.log(e);
      
    }
  }

  @RolesCheck([...Object.values(Roles)])
  @Get('/deatails/:id')
  findOne(@Param('id') id: string , @Res() res : Response) {
    try{

      return this.companyService.findOne(id , res);

    }catch(e){

      if(e) console.log(e);
      
    }
  }

  @RolesCheck([Roles.admin , Roles.marketing])
  @UcpCheck([ROLE_UCP.ADMIN , ROLE_UCP.USER])
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string, 
    @Body(new ParserBooleanIsActive()) 
    updateCompanyDto: UpdateCompanyDto , 
    @UserByToken() userByToken : any,
    @Res() res : Response,
    @UploadedFile(new ImagePipe()) 
    file? : Express.Multer.File) 
    {
  
    try{

    return this.companyService.update(id, updateCompanyDto , userByToken , res , file);

    }catch(e){

      if(e) console.log(e);
      
    }
  }

  @RolesCheck([Roles.admin , Roles.marketing])
  @Delete(':id')
  remove(@Param('id') id: string , @Headers() headers : any ) {
    return this.companyService.remove(id , getUserByReq(headers));
  }

}
