import { FindList } from 'src/common/interfaces/res.interfaces';
import { CandidateEntity } from './../../candidate/entities/candidate.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { In, Repository } from 'typeorm';
import { UserCa } from '../entities/user-ca.entity';
import { UpdateUserCaDto } from '../dto/update-user-ca.dto';
import { CreateUserCaDto } from '../dto/create-user-ca.dto';
import { CreateAdminUcaDto } from '../dto/create-admin-uca';
import { Roles } from 'src/common/enum/role.enum';
import {
  ADD_NEW_UCA_FAIL,
  ADD_NEW_UCA_SUCCESS,
} from 'src/common/constant/message';

@Injectable()
export class UserCaService {
  constructor(
    @InjectRepository(UserCa) private readonly ucaEntity: Repository<UserCa>,
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
    @InjectRepository(CandidateEntity)
    private readonly candidateEntity: Repository<CandidateEntity>,
  ) {}

  async create(createUserCaDto: CreateUserCaDto): Promise<FindList<UserCa>> {
    const share = createUserCaDto.share;
    let checkUsers: UserEntity[];
    let checkCandidates: CandidateEntity[];
    const failUsers = [];
    const failCandidates = [];
    if (share.listIdUsers.length > 0) {
      checkUsers = await this.userEntity.find({
        where: {
          id: In(createUserCaDto.share.listIdUsers),
        },
      });

      if (checkUsers.length !== share.listIdUsers.length) {
        for (const e of share.listIdUsers) {
          let flag = false;
          for (const element of checkUsers) {
            if (e === element.id) {
              flag = true;
            }
          }

          if (flag === false) {
            failUsers.push(e);
          }
        }
      }
    }

    if (share.idCandidates.length > 0) {
      checkCandidates = await this.candidateEntity.find({
        where: {
          id: In(share.idCandidates),
        },
      });

      if (checkCandidates.length !== share.idCandidates.length) {
        for (const e of share.idCandidates) {
          let flag = false;
          for (const element of checkCandidates) {
            if (e === element.id) {
              flag = true;
            }
          }

          if (flag === false) {
            failCandidates.push(e);
          }
        }
      }
    }

    if (checkUsers.length < 1 || checkCandidates.length < 1)
      return {
        message: ADD_NEW_UCA_FAIL,
        status: HttpStatus.BAD_REQUEST,
        data: undefined,
        total: undefined,
        failList: {
          failCandidates,
          failUsers,
        },
      };

    const listUca: UserCa[] = [];
    for (const e of checkCandidates) {
      for (const element of checkUsers) {
        const infoUca = {
          candidate: e,
          user: element,
        };
        const newUca = await this.ucaEntity.save(infoUca);
        listUca.push(newUca);
      }
    }

    return {
      message: ADD_NEW_UCA_SUCCESS,
      status: HttpStatus.OK,
      data: listUca,
      total: listUca.length,
      failList: {
        failCandidates,
        failUsers,
      },
    };
  }

  findAll() {
    return `This action returns all userCa`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userCa`;
  }

  update(id: number, updateUserCaDto: UpdateUserCaDto) {
    return `This action updates a #${id} userCa`;
  }

  remove(id: number) {
    return `This action removes a #${id} userCa`;
  }

  async addAminUca(createAdminUca: CreateAdminUcaDto) {
    const checkUser = await this.userEntity.findOne({
      where: {
        id: createAdminUca.idUser,
      },
    });

    const checkCandidate = await this.candidateEntity.findOne({
      where: {
        id: createAdminUca.idCandidate,
      },
    });

    if (checkUser && checkCandidate) {
      const newUcoInfo = {
        user: checkUser,
        candidate: checkCandidate,
        role: Roles.ucp_admin,
      };
      await this.ucaEntity.save(newUcoInfo);

      return true;
    }
  }
}
