import { Req, UploadedFile } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParserDataPipe } from './../pipe/ParserData.pipe';
import { Request, Response } from 'express';
import { UserEntity } from 'src/users/entities/user.entity';
import { Roles } from './../../common/enum/role.enum';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  SetMetadata,
  Headers,
  ParseIntPipe,
  DefaultValuePipe,
  Query,
  ParseBoolPipe,
  UseInterceptors,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UsersService } from '../services/users.service';
import { UserByToken } from '../interceptor/TransformAccountHistoryActive.decorator';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ParseUUIDPipe } from '@nestjs/common/pipes';
import { ImagePipe } from '../pipe/Image.pipe';
import { ParseBoolenPipe } from '../pipe/ParseBoolen.pipe';
import { ParseParamPipe } from '../pipe/ParseParamPipe.pipe';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolesCheck } from 'src/common/decorator/roles.guard';
import nodeMailerMain from 'src/common/middleware/node-mailer';
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
  ) {}

  @Post()
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
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile(new ImagePipe()) file?: Express.Multer.File,
    @UserByToken() userCreated?: string,
    @Res() res?: Response,
  ) {
    try {
      return this.usersService.create(createUserDto, userCreated, file, res);
    } catch (e) {
      if (e) console.log(e);
    }
  }

  @Get()
  @RolesCheck([Roles.admin])
  @ApiResponse({
    status: 403,
    description: 'Bạn không có quyền thao với chức năng này !',
  })
  @ApiOperation({
    summary: 'Lấy danh sách tài khoản !',
  })
  findAll(@Res() res: Response) {
    try {
      return this.usersService.findAll(res);
    } catch (e) {
      if (e) console.log(e);
    }
  }

  @RolesCheck([Roles.admin])
  @Get('details/:id')
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin tài khoản thành công !',
  })
  @ApiResponse({
    status: 400,
    description: 'Tài khoản tìm kiếm không tồn tại !',
  })
  @ApiResponse({
    status: 403,
    description: 'Bạn không có quyền thao với chức năng này !',
  })
  @ApiResponse({
    status: 403,
    description: 'Vui lòng kiểm tra lại id tài khoản!',
  })
  @ApiOperation({
    summary: 'Lấy thông tin chi tiết tài khoản',
  })
  findOne(@Param('id', new ParseUUIDPipe()) id: string, @Res() res: Response) {
    try {
      return this.usersService.findOne(id, res);
    } catch (e) {
      if (e) console.log(e);
    }
  }

  @RolesCheck([Roles.admin])
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Cập nhật thông tin tài khoản !',
  })
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @UploadedFile(new ImagePipe()) file?: Express.Multer.File,
    @Body(new ParseBoolenPipe()) updateUserDto?: UpdateUserDto,
    @UserByToken() userUpdate?: string,
    @Res() res?: Response,
  ) {
    try {
      return await this.usersService.update(
        id,
        updateUserDto,
        userUpdate,
        res,
        file,
      );
    } catch (e) {
      if (e) console.log(e);
    }
  }

  @ApiOperation({
    summary: 'Xóa tài khoản !',
  })
  @RolesCheck([Roles.admin])
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @UserByToken() userUpdate: string,
    @Res() res: Response,
  ) {
    try {
      return this.usersService.remove(id, userUpdate, res);
    } catch (e) {
      if (e) console.log(e);
    }
  }

  @Post('test/:page?')
  @ApiOperation({
    summary: 'Test',
  })
  // @UseInterceptors(TransformResCreateUser)
  async test(
    @Param('page', new DefaultValuePipe(0)) page?: number,
    @Query('active', new DefaultValuePipe(true), ParseBoolPipe)
    active?: boolean,
    @UserByToken() UserBytoken?: string,
  ) {
    try {
    } catch (e) {
      if (e) throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/:page?')
  async searchList(
    @Req() req: Request,
    @Param() param: { page?: number },
    @Query(new ParseParamPipe()) query: any,
    @Res() res: Response,
  ) {
    try {
      await this.usersService.searchList(
        query.search,
        query.isActive,
        param.page,
        res,
      );
    } catch (e) {
      if (e) console.log(e);
    }
  }
}
