import { ImagePipe } from 'src/users/pipe/Image.pipe';
import { UserByToken } from './../../users/interceptor/TransformAccountHistoryActive.decorator';
import { RolesCheck } from 'src/common/decorator/roles.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { CreateCandidateDto } from '../dto/create-candidate.dto';
import { UpdateCandidateDto } from '../dto/update-candidate.dto';
import { CandidateService } from '../services/candidate.service';
import { Roles } from 'src/common/enum/role.enum';
import { UsersService } from 'src/users/services/users.service';
import {
  Headers,
  Query,
  Res,
  UploadedFile,
} from '@nestjs/common/decorators/http/route-params.decorator';
import getUserByReq from 'src/common/func/getUserByHeaderReq';
import * as fs from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';
import { Inject } from '@nestjs/common/decorators';
import { forwardRef } from '@nestjs/common/utils';
import { Response } from 'express';
import { ParseQuery } from 'src/common/pipe/ParseQuery.pipe';
import { QueryDto } from 'src/common/interfaces/QueryFilter.interface';
import { ParseStrPipe } from 'src/common/pipe/ParseStr.pipe';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { apiDecorator } from 'src/common/decorator/multer.decorator';
import { removeFile } from 'src/common/func/handleImage';
dotenv.config();
@ApiTags('candidate')
@Controller('candidate')
export class CandidateController {
  constructor(
    private readonly candidateService: CandidateService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Create candidate' })
  @apiDecorator()
  @RolesCheck([Roles.admin, Roles.content])
  @Post()
  @UseInterceptors(FileInterceptor('background'))
  async create(
    @Body(new ParseStrPipe()) createCandidateDto: CreateCandidateDto,
    @UserByToken() userBytoken: any,
    @Res() res: Response,
    @UploadedFile(new ImagePipe()) file: Express.Multer.File,
  ) {
    try {
      return await this.candidateService.create(
        createCandidateDto,
        userBytoken,
        file,
        res,
      );
    } catch (e) {
      if (e) {
        removeFile(file.path);
        throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @RolesCheck([...Object.values(Roles)])
  @Get('')
  async findAll(
    @Res() res: Response,
    @Query(new ParseQuery()) query: QueryDto,
  ) {
    try {
      return await this.candidateService.findAll(res, query);
    } catch (e) {
      if (e) console.log(e);
    }
  }
  @RolesCheck([...Object.values(Roles)])
  @Get('/detail/:id')
  findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      return this.candidateService.findOne(id, res);
    } catch (e) {
      if (e) console.log(e);
    }
  }

  @RolesCheck([Roles.admin, Roles.content])
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() updateCandidateDto: UpdateCandidateDto,
    @UserByToken() user: string,
    @Res() res: Response,
    @UploadedFile(new ImagePipe()) file?: Express.Multer.File,
  ) {
    try {
      return this.candidateService.update(
        id,
        updateCandidateDto,
        user,
        res,
        file,
      );
    } catch (e) {
      if (e) console.log(e);
    }
  }

  @RolesCheck([Roles.admin, Roles.content])
  @Delete(':id')
  remove(@Param('id') id: string, @Headers() headers?: any) {
    return this.candidateService.remove(id, getUserByReq(headers));
  }

  @Post('upload/image')
  async upload(@UploadedFile() bg?: Express.Multer.File) {
    const mimeType = bg.mimetype.split('/')[1];
    const filename = bg.filename;
    const path = bg.path;
    const bufferFile = fs.readFileSync(path);
    const fileSave = `${filename + Date.now()}.${mimeType}`;
    const newFile = fs.writeFileSync(
      process.env.STATICIMG + fileSave,
      bufferFile,
    );
    const hostImage = process.env.HOST + fileSave;
    return hostImage;
  }

  @UseInterceptors(FileInterceptor('excel'))
  @Post('upload/excel')
  async uploadExcelCandidate(@UploadedFile() excelFile?: Express.Multer.File) {
    console.log(excelFile);
    const path = excelFile.path;
    fs.readFileSync(path);
  }
}
