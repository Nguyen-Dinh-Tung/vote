import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserCoService } from '../services/user-co.service';
import { CreateUserCoDto } from '../dto/create-user-co.dto';
import { UpdateUserCoDto } from '../dto/update-user-co.dto';

@Controller('user-co')
export class UserCoController {
  constructor(private readonly userCoService: UserCoService) {}

  @Post()
  create(@Body() createUserCoDto: CreateUserCoDto) {
    try{

    return this.userCoService.create(createUserCoDto);

    }catch(e) {

      if(e) console.log(e);
      
    }
  }

  @Get()
  findAll() {
    return this.userCoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userCoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserCoDto: UpdateUserCoDto) {
    return this.userCoService.update(+id, updateUserCoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userCoService.remove(+id);
  }
}
