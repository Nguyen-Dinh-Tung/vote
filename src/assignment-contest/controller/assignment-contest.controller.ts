import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateAssignmentContestDto } from '../dto/create-assignment-contest.dto';
import { UpdateAssignmentContestDto } from '../dto/update-assignment-contest.dto';
import { AssignmentContestService } from '../services/assignment-contest.service';

@Controller('assignment-contest')
export class AssignmentContestController {
  constructor(
    private readonly assignmentContestService: AssignmentContestService,
  ) {}

  @Post()
  create(@Body() createAssignmentContestDto: CreateAssignmentContestDto) {
    try {
      return this.assignmentContestService.create(createAssignmentContestDto);
    } catch (e) {
      if (e) console.log(e);
    }
  }

  @Get()
  findAll() {
    return this.assignmentContestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assignmentContestService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAssignmentContestDto: UpdateAssignmentContestDto,
  ) {
    return this.assignmentContestService.update(
      +id,
      updateAssignmentContestDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assignmentContestService.remove(+id);
  }
}
