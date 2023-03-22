import { Injectable } from '@nestjs/common';
import { CreateAuthShareDto } from './dto/create-auth-share.dto';
import { UpdateAuthShareDto } from './dto/update-auth-share.dto';

@Injectable()
export class AuthShareService {
  create(createAuthShareDto: CreateAuthShareDto) {
    return 'This action adds a new authShare';
  }

  findAll() {
    return `This action returns all authShare`;
  }

  findOne(id: number) {
    return `This action returns a #${id} authShare`;
  }

  update(id: number, updateAuthShareDto: UpdateAuthShareDto) {
    return `This action updates a #${id} authShare`;
  }

  remove(id: number) {
    return `This action removes a #${id} authShare`;
  }
}
