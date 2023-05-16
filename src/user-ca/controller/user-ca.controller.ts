import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ParseStrPipe } from 'src/common/pipe/ParseStr.pipe';
import { CreateUserCaDto } from '../dto/create-user-ca.dto';
import { UpdateUserCaDto } from '../dto/update-user-ca.dto';
import { UserCaService } from '../services/user-ca.service';

@Controller('user-ca')
export class UserCaController {
  constructor(private readonly userCaService: UserCaService) {}

  @Post()
  async create(
    @Body(new ParseStrPipe()) createUserCaDto: CreateUserCaDto,
    @Res() res: Response,
  ) {
    try {
      const resCreateUca = await this.userCaService.create(createUserCaDto);

      return res.status(resCreateUca.status).json({
        message: resCreateUca,
        data: resCreateUca.data,
      });
    } catch (e) {
      if (e) console.log(e);
    }
  }

  @Get()
  findAll() {
    return this.userCaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userCaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserCaDto: UpdateUserCaDto) {
    return this.userCaService.update(+id, updateUserCaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userCaService.remove(+id);
  }
}
