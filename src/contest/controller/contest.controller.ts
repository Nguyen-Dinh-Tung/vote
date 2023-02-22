import { RolesCheck } from 'src/common/decorator/roles.guard';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateContestDto } from '../dto/create-contest.dto';
import { UpdateContestDto } from '../dto/update-contest.dto';
import { ContestService } from '../services/contest.service';
import { Roles } from 'src/common/enum/role.enum';
import { Headers, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common/decorators';
import getUserByReq from 'src/common/func/getUserByHeaderReq';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UserByToken } from 'src/users/interceptor/TransformAccountHistoryActive.decorator';
import { ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { ImagePipe } from 'src/users/pipe/Image.pipe';
import { Response } from 'express';


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
  @Body() createContestDto: CreateContestDto ,
  @UploadedFile(new ImagePipe()) file? : Express.Multer.File  ,
  @UserByToken() userByToken? : string , @Res() res? : Response) {
    try{

      return this.contestService.create(createContestDto , file, userByToken , res);

    }catch(e){

      if(e ) console.log(e);
      
    }
  }

  @RolesCheck([...Object.values(Roles)])
  @Get()
  findAll() {
    return this.contestService.findAll();
  }

  @RolesCheck([...Object.values(Roles)])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contestService.findOne(id);
  }

  @RolesCheck([Roles.admin , Roles.marketing])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContestDto: UpdateContestDto , @Headers() headers : any) {
    return this.contestService.update(id, updateContestDto , getUserByReq(headers));
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
  @UseInterceptors(FileInterceptor('file') )
  async test(@Body()data ,@UploadedFile() file: Express.Multer.File){
    return this.contestService.createNewContest(data , file)
  }

}
// d03091cfd89e8d4206ffba6d1ceba7bd


