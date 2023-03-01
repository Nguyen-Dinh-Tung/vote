import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { AssignmentCompanyService } from '../service/assignment-company.service';
import { CreateAssignmentCompanyDto } from '../dto/create-assignment-company.dto';
import { UpdateAssignmentCompanyDto } from '../dto/update-assignment-company.dto';
import { Response } from 'express';
import { ParserBoolean } from 'src/contest/pipe/ParserBoolean.pipe';
import { ParseParamPipe } from 'src/users/pipe/ParseParamPipe.pipe';
import { ParseAssm } from 'src/common/pipe/ParseAssm.pipe';

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

  @Get('/:id/:page?')
  async findAll(
    @Res() res : Response,
    @Param() param? : any ,
    @Query(new ParserBoolean()) query? : any ,
   ) {
    
    try{

    return await this.assignmentCompanyService.findAll(res , param.page , param.id , query.isActive , query.search) ;

    }catch(e){

      if(e) console.log(e);
      
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assignmentCompanyService.findOne(+id);
  }

  @Patch('/:id')
  async update(@Param('id') id: string, @Body(new ParseAssm()) updateAssignmentCompanyDto: UpdateAssignmentCompanyDto , @Res() res : Response) {
    try{

    return this.assignmentCompanyService.update(id, updateAssignmentCompanyDto , res);

    }catch(e){

      if(e) console.log(e);
      
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assignmentCompanyService.remove(+id);
  }
}
