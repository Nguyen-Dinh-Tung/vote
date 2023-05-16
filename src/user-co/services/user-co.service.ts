import {
  USER_NOT_EXISTING_SYSTEM,
  USER_NOT_FOUND,
} from './../../users/contants/message';
import { UserEntity } from './../../users/entities/user.entity';
import { CONTEST_NOT_FOUND } from './../../assignment-company/contants/contant';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContestEntity } from 'src/contest/entities/contest.entity';
import { UserCp } from 'src/user-cp/entities/user-cp.entity';
import { Repository, In } from 'typeorm';
import { CreateUserCoDto } from '../dto/create-user-co.dto';
import { UpdateUserCoDto } from '../dto/update-user-co.dto';
import { FindList } from 'src/common/interfaces/res.interfaces';
import { ADD_NEW_UCO_SUCCESS } from 'src/common/constant/message';
import { UserCo } from '../entities/user-co.entity';

@Injectable()
export class UserCoService {
  constructor(
    @InjectRepository(UserCo) private readonly ucoEntity: Repository<UserCo>,
    @InjectRepository(ContestEntity)
    private readonly contestEntity: Repository<ContestEntity>,
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
  ) {}
  async create(createUserCoDto: CreateUserCoDto): Promise<FindList<UserCo>> {
    const checkContest = await this.contestEntity.findOne({
      where: {
        id: createUserCoDto.idContest,
      },
    });

    const checkUsers = await this.userEntity.find({
      where: {
        id: In(createUserCoDto.idUsers),
      },
    });

    if (!checkContest)
      return {
        message: CONTEST_NOT_FOUND,
        status: HttpStatus.NOT_FOUND,
        data: undefined,
        total: undefined,
        failList: undefined,
      };

    if (!checkUsers || checkUsers.length < 1)
      return {
        message: USER_NOT_FOUND,
        status: HttpStatus.NOT_FOUND,
        data: undefined,
        total: undefined,
        failList: undefined,
      };

    const listUco = [];
    for (const e of checkUsers) {
      const infoNewUco = {
        contest: checkContest,
        user: e,
      };

      const newUco = await this.ucoEntity.save(infoNewUco);
      if (newUco) listUco.push(newUco);
    }
    return {
      message: ADD_NEW_UCO_SUCCESS,
      status: HttpStatus.NOT_FOUND,
      data: listUco,
      total: listUco.length,
      failList: undefined,
    };
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
