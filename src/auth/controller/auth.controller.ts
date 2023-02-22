import { FileInterceptor } from '@nestjs/platform-express';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginUserDto } from '../dto/login-auth.dto';
import { Res, UploadedFile } from '@nestjs/common/decorators';
import { Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginUserDtn: LoginUserDto , @Res() res : Response) {

    return this.authService.login(loginUserDtn , res);
    
  }
  @Post('register')
  @ApiResponse({status : 201 , description : 'Tạo tài khoản thành công !'})
  @ApiResponse({status : 400 , description : 'Thông tin tài khoản chưa hoàn chỉnh vui lòng thao tác bổ sung !'})
  @ApiResponse({status : 403 , description : 'Bạn không có quyền thao với chức năng này !'})
  @ApiResponse({status : 409 , description : 'Thông tin tài khoản đã tồn tại !'})
  @ApiOperation({
    summary: 'Tạo tài khoản mới !',
  })
  @UseInterceptors(FileInterceptor('file'))
  async register(@Body()createDto : CreateUserDto , @UploadedFile() file : Express.Multer.File, @Res() res? : Response){
    return await this.authService.register(createDto , file , 'default' , res)
  }
}
