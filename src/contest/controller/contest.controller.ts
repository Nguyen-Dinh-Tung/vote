import { ParseQuery } from './../../common/pipe/ParseQuery.pipe';
import { ParseStrPipe } from './../../common/pipe/ParseStr.pipe';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateContestDto } from '../dto/create-contest.dto';
import { UpdateContestDto } from '../dto/update-contest.dto';
import { ContestService } from '../services/contest.service';
import { Roles } from 'src/common/enum/role.enum';
import { Headers, Query, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common/decorators';
import getUserByReq from 'src/common/func/getUserByHeaderReq';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UserByToken } from 'src/users/interceptor/TransformAccountHistoryActive.decorator';
import { ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { ImagePipe } from 'src/users/pipe/Image.pipe';
import { Response } from 'express';
import { ParserBoolean } from '../pipe/ParserBoolean.pipe';
import { RolesCheck } from 'src/common/decorator/roles.guard';


@Controller('contest')
export class ContestController {
  constructor(private readonly contestService: ContestService) {}

  @RolesCheck([Roles.admin , Roles.marketing])
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Tạo cuộc thi mới !',
  })
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
  @Body(new ParseStrPipe()) createContestDto: CreateContestDto ,
  @UploadedFile(new ImagePipe()) file? : Express.Multer.File  ,
  @UserByToken() userByToken? : string , @Res() res? : Response) {
    try{

      console.log('check');
      
      return this.contestService.create(createContestDto , file, userByToken , res);

    }catch(e){

      if(e ) console.log(e);
      
    }
  }

  @RolesCheck([...Object.values(Roles)])
  @Get(':page?')
  findAll(
    @Res() res : Response ,
    @Param() params : {page : number} ,
    @Query(new ParseQuery()) query : any ,
    
    ) {
    try{
      let page : number = Number(params) ;
      console.log(page);
      
      if(!page)
      page = 1
      return this.contestService.findAll(res , page , query);

    }catch(e){

      if(e) console.log(e);
      
    }
  }

  @RolesCheck([...Object.values(Roles)])
  @Get('/detail/:id')
  findOne(@Param('id') id: string , @Res() res : Response) {
    return this.contestService.getDetailsContest(id , res);
  }

  @RolesCheck([Roles.admin , Roles.marketing])
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  update(
  @Param('id') id: string,
  @Body(new ParserBoolean()) updateContestDto: UpdateContestDto ,
  @UserByToken() userChange : string , 
  @Res() res : Response,
  @UploadedFile('file',new ImagePipe()) file? : Express.Multer.File ) {

    try{

    return this.contestService.update(id, updateContestDto , userChange ,res, file);

    }catch(e){

      if(e) console.log(e);
      
    }
  }


  @RolesCheck([Roles.admin , Roles.marketing])
  @Delete(':id')
  remove(@Param('id') id: string  , @Headers() headers : any) {
    return this.contestService.remove(id , getUserByReq(headers));
  }

  @Post("relation/:id")
  getContestByIdCompany(@Param("id") id : string){
    return this.contestService.getContestByIdCompany(id)
  }
  @Post('/test')
  async test(
    @Body()data ,
    @Res()res : Response
    ){
    return this.contestService.findTest(data,res)
  }


}
// d03091cfd89e8d4206ffba6d1ceba7bd


