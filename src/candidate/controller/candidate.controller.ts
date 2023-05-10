import { ParseParamPipe } from 'src/users/pipe/ParseParamPipe.pipe';
import { GET_LIST_CANDIDATE_SUCCESS } from 'src/candidate/contants/message';
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
  DefaultValuePipe,
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
import { QueryFilter } from 'src/common/interfaces/QueryFilter.interface';
import { ParseStrPipe } from 'src/common/pipe/ParseStr.pipe';
import { IdUserInterceptor } from 'src/users/interceptor/IdUserInterceptor';
dotenv.config();
@Controller('candidate')
export class CandidateController {
  constructor(
    private readonly candidateService: CandidateService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  @RolesCheck([Roles.admin, Roles.content])
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body(new ParseStrPipe()) createCandidateDto: CreateCandidateDto,
    @UserByToken() userBytoken: any,
    @Res() res: Response,
    @IdUserInterceptor() idUser: string,
    @UploadedFile(new ImagePipe()) file?: Express.Multer.File,
  ) {
    try {
      let resAddCa = await this.candidateService.create(
        createCandidateDto,
        idUser,
        res,
        userBytoken,
        file,
      );
      return res.status(resAddCa.status).json({
        message: resAddCa.message,
        failList: resAddCa.failList,
        newCandidate: resAddCa?.data,
        share: resAddCa?.share,
        admin: resAddCa?.admin,
      });
    } catch (e) {
      if (e) console.log(e);
    }
  }

  @RolesCheck([...Object.values(Roles)])
  @Get('/:page?')
  async findAll(
    @Res() res: Response,
    @Param('page', new DefaultValuePipe(1)) params: { page: number },
    @Query(new ParseQuery()) query: QueryFilter,
  ) {
    try {
      let page: number = Number(params);
      if (!page) page = 1;

      return await this.candidateService.findAll(
        res,
        page,
        query.isActive,
        query.search,
      );
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
    let mimeType = bg.mimetype.split('/')[1];
    let filename = bg.filename;
    let path = bg.path;
    let bufferFile = fs.readFileSync(path);
    let fileSave = `${filename + Date.now()}.${mimeType}`;
    let newFile = fs.writeFileSync(
      process.env.STATICIMG + fileSave,
      bufferFile,
    );
    let hostImage = process.env.HOST + fileSave;
    return hostImage;
  }

  @UseInterceptors(FileInterceptor('excel'))
  @Post('upload/excel')
  async uploadExcelCandidate(@UploadedFile() excelFile?: Express.Multer.File) {
    console.log(excelFile);
    let path = excelFile.path;
    fs.readFileSync(path);
  }
}
