import { Injectable } from '@nestjs/common';
import { CreateUserCoDto } from './dto/create-user-co.dto';
import { UpdateUserCoDto } from './dto/update-user-co.dto';

@Injectable()
export class UserCoService {
  create(createUserCoDto: CreateUserCoDto) {
    return 'This action adds a new userCo';
  }

  findAll() {
    return `This action returns all userCo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userCo`;
  }

  update(id: number, updateUserCoDto: UpdateUserCoDto) {
    return `This action updates a #${id} userCo`;
  }

  remove(id: number) {
    return `This action removes a #${id} userCo`;
  }
}
