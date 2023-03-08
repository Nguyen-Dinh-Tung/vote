import { join } from 'path';
import { Roles } from './../../common/enum/role.enum';
import { Controller, Get, Post, Body, Patch, Param, Delete, Res, StreamableFile } from '@nestjs/common';
import { UserCpService } from '../services/user-cp.service';
import { CreateUserCpDto } from '../dto/create-user-cp.dto';
import { UpdateUserCpDto } from '../dto/update-user-cp.dto';
import { UserByToken } from 'src/users/interceptor/TransformAccountHistoryActive.decorator';
import { Response } from 'express';
import { IdUserInterceptor } from 'src/users/interceptor/IdUserInterceptor';
import { RolesCheck } from 'src/common/decorator/roles.guard';
import { createReadStream } from 'fs';

@Controller('user-cp')
export class UserCpController {
  constructor(private readonly userCpService: UserCpService) {}

  @Post()
  @RolesCheck([ Roles.admin , Roles.ucp_admin])
  async create(
    @Body() createUserCpDto: CreateUserCpDto , 
    @UserByToken() user : string , 
    @Res() res : Response,
    @IdUserInterceptor() idUser : string
    ) {
    try{
      
    return await this.userCpService.create(createUserCpDto , user , res ,idUser);

    }catch(e){

      if(e) console.log(e);
      
    }

  }

  @Get()
  findAll() {
    return this.userCpService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userCpService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserCpDto: UpdateUserCpDto) {
    return this.userCpService.update(+id, updateUserCpDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userCpService.remove(+id);
  }


  @Get('/test')
  download(){
    const file = createReadStream(join(process.cwd(), 'demo.jpeg'));
    return new StreamableFile(file);
  }
}
