import { ImagePipe } from 'src/users/pipe/Image.pipe';
import { UserByToken } from './../../users/interceptor/TransformAccountHistoryActive.decorator';
import { RolesCheck } from 'src/common/decorator/roles.guard';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { CreateCandidateDto } from '../dto/create-candidate.dto';
import { UpdateCandidateDto } from '../dto/update-candidate.dto';
import { CandidateService } from '../services/candidate.service';
import { Roles } from 'src/common/enum/role.enum';
import { UsersService } from 'src/users/services/users.service';
import { Headers, Res, UploadedFile } from '@nestjs/common/decorators/http/route-params.decorator';
import getUserByReq from 'src/common/func/getUserByHeaderReq';
import  * as fs from 'fs'
import { FileInterceptor } from '@nestjs/platform-express';
import * as dotenv from 'dotenv' 
import { Inject } from '@nestjs/common/decorators';
import { forwardRef } from '@nestjs/common/utils';
import { Response } from 'express';
dotenv.config()
@Controller('candidate')

export class CandidateController {

  constructor(private readonly candidateService: CandidateService,
    @Inject(forwardRef(() => UsersService))
  private usersService : UsersService  
  ) {}


  @RolesCheck([Roles.admin ,Roles.content])
  @Post()
  @UseInterceptors(FileInterceptor('file') )
  create(@Body() createCandidateDto: CreateCandidateDto , @UserByToken() userBytoken : any , @Res() res : Response , @UploadedFile(new ImagePipe()) file? : Express.Multer.File) {
    try{

    return this.candidateService.create(createCandidateDto , userBytoken , res , file);

    }catch(e){

      if(e) console.log(e);
      
    }
  }

  @RolesCheck([...Object.values(Roles)])
  @Get()
  findAll( @Res() res : Response) {
    try{

      return this.candidateService.findAll(res);

    }catch(e){

      if(e) console.log(e);
      
    }
  }

  @RolesCheck([...Object.values(Roles)])
  @Get(':id')
  findOne(@Param('id') id: string , @Res() res : Response)  {
    try{

      return this.candidateService.findOne(id , res);

    }catch(e){

      if(e) console.log(e);
      
    }
  }

  @RolesCheck([Roles.admin ,Roles.content])
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file') )
  update(@Param('id') id: string, @Body() updateCandidateDto: UpdateCandidateDto , @UserByToken() user : string, @Res() res : Response , @UploadedFile(new ImagePipe()) file ? : Express.Multer.File)  {

    try{

    return this.candidateService.update(id, updateCandidateDto , user , res , file);

    }catch(e){

      if(e) console.log(e);
      
    }
  }

  @RolesCheck([Roles.admin ,Roles.content])
  @Delete(':id')
  remove(@Param('id') id: string , @Headers() headers? : any) {
    return this.candidateService.remove(id , getUserByReq(headers));
  }

  @Post('upload/image')
  async upload(@UploadedFile() bg? : Express.Multer.File){
    console.log(bg);
    let mimeType = bg.mimetype.split('/')[1] ;
    console.log(bg);
    let filename = bg.filename ;
    let path = bg.path
    let bufferFile = fs.readFileSync(path)
    let fileSave = `${filename + Date.now()}.${mimeType}`
    let newFile = fs.writeFileSync(process.env.STATICIMG + fileSave ,bufferFile) ;
    let hostImage = process.env.HOST + fileSave
    return hostImage    
  }


  @UseInterceptors(FileInterceptor('excel') )
  @Post('upload/excel')
  async uploadExcelCandidate(@UploadedFile() excelFile? : Express.Multer.File){
    
    console.log(excelFile);
    let path = excelFile.path ;
    fs.readFileSync(path)
    
  }




}
