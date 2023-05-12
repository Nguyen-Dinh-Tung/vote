import { FileInterceptor } from '@nestjs/platform-express';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginUserDto } from '../dto/login-auth.dto';
import { Res, UploadedFile } from '@nestjs/common/decorators';
import { Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginUserDtn: LoginUserDto, @Res() res: Response) {
    try {
      return this.authService.login(loginUserDtn, res);
    } catch (e) {
      if (e) console.log(e);
    }
  }
  @Post('register')
  @ApiResponse({ status: 201, description: 'Tạo tài khoản thành công !' })
  @ApiResponse({
    status: 400,
    description:
      'Thông tin tài khoản chưa hoàn chỉnh vui lòng thao tác bổ sung !',
  })
  @ApiResponse({
    status: 403,
    description: 'Bạn không có quyền thao với chức năng này !',
  })
  @ApiResponse({ status: 409, description: 'Thông tin tài khoản đã tồn tại !' })
  @ApiOperation({
    summary: 'Tạo tài khoản mới !',
  })
  @UseInterceptors(FileInterceptor('file'))
  async register(
    @Body() createDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res?: Response,
  ) {
    return await this.authService.register(createDto, file, 'default', res);
  }

  @Post('token-email')
  @ApiOperation({ summary: 'get token' })
  async forgotPassword(@Body() data: ForgotPasswordDto, @Res() res: Response) {
    try {
      return await this.authService.forgotPassword(data, res);
    } catch (e) {
      if (e)
        throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @ApiOperation({
    summary: 'Change password',
  })
  @Post('password')
  async changePassword(@Body() data: ChangePasswordDto, @Res() res: Response) {
    try {
      return this.authService.changPassword(data, res);
    } catch (e) {
      if (e)
        throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
