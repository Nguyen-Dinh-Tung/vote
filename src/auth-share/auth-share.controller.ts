import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthShareService } from './auth-share.service';
import { CreateAuthShareDto } from './dto/create-auth-share.dto';
import { UpdateAuthShareDto } from './dto/update-auth-share.dto';

@Controller('auth-share')
export class AuthShareController {
  constructor(private readonly authShareService: AuthShareService) {}

  @Post()
  create(@Body() createAuthShareDto: CreateAuthShareDto) {
    return this.authShareService.create(createAuthShareDto);
  }

  @Get()
  findAll() {
    return this.authShareService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authShareService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthShareDto: UpdateAuthShareDto) {
    return this.authShareService.update(+id, updateAuthShareDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authShareService.remove(+id);
  }
}
