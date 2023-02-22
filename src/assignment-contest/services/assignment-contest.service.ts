import { Injectable } from '@nestjs/common';
import { CreateAssignmentContestDto } from '../dto/create-assignment-contest.dto';
import { UpdateAssignmentContestDto } from '../dto/update-assignment-contest.dto';

@Injectable()
export class AssignmentContestService {
  create(createAssignmentContestDto: CreateAssignmentContestDto) {
    return 'This action adds a new assignmentContest';
  }

  findAll() {
    return `This action returns all assignmentContest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} assignmentContest`;
  }

  update(id: number, updateAssignmentContestDto: UpdateAssignmentContestDto) {
    return `This action updates a #${id} assignmentContest`;
  }

  remove(id: number) {
    return `This action removes a #${id} assignmentContest`;
  }
}
