import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AssignmentCompanyService } from '../service/assignment-company.service';
import { CreateAssignmentCompanyDto } from '../dto/create-assignment-company.dto';
import { UpdateAssignmentCompanyDto } from '../dto/update-assignment-company.dto';
import { Response } from 'express';

@Controller('assignment-company')
export class AssignmentCompanyController {
  constructor(private readonly assignmentCompanyService: AssignmentCompanyService) {}

  @Post()
  async create(@Body() createAssignmentCompanyDto: CreateAssignmentCompanyDto , @Res() res : Response) {
    try{

    return await this.assignmentCompanyService.create(createAssignmentCompanyDto ,res);

    }catch(e){

      if(e) console.log(e);
      

    }
  }

  @Get()
  findAll() {
    return this.assignmentCompanyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assignmentCompanyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAssignmentCompanyDto: UpdateAssignmentCompanyDto) {
    return this.assignmentCompanyService.update(+id, updateAssignmentCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assignmentCompanyService.remove(+id);
  }
}
