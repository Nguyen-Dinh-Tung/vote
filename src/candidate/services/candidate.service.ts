import { SEARCH_KEY_NOT_FOUNT, FILTER_FAIL } from './../contants/message';
import { amount } from './../../users/contants/amount.in.page';
import { UserCa } from './../../user-ca/entities/user-ca.entity';
import { NOT_DATA } from './../../contest/contants/contants';
import { ContestEntity } from './../../contest/entities/contest.entity';
import { NotFoundError } from 'rxjs';
import { CandidateEntity } from './../entities/candidate.entity';
import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Validate } from 'src/common/class/validate.entity';
import { Repository, Like } from 'typeorm';
import { CreateCandidateDto } from '../dto/create-candidate.dto';
import { UpdateCandidateDto } from '../dto/update-candidate.dto';
import { AssmContestEntity } from 'src/assignment-contest/entities/assignment-contest.entity';
import * as dotenv from 'dotenv';
import { Response } from 'express';
import {
  ADD_CANDIDATE_SUCCESS,
  CANDIDATE_EXIST,
  CANDIDATE_NOT_EXIST,
  GET_DETAIL_CANDIDATE_SUCCESS,
  GET_LIST_CANDIDATE_SUCCESS,
  UPDATE_CANDIDATE_SUCCESS,
} from '../contants/message';
import { CandidateRecomendEntity } from '../entities/candidate-recomend.entity';
import { AssignmentContestService } from 'src/assignment-contest/services/assignment-contest.service';
import { QueryDto } from 'src/common/interfaces/QueryFilter.interface';
import { Transactional } from 'typeorm-transactional';
import { appErrorResponse } from 'src/common/response/app-response.error';
import { saveImage } from 'src/common/func/handleImage';
import { appResSuccess } from 'src/common/response/app-res.success';
import { UserEntity } from 'src/users/entities/user.entity';
import { USER_NOT_FOUND } from 'src/users/contants/message';
dotenv.config();

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(CandidateEntity)
    private readonly candidateEntity: Repository<CandidateEntity>,
    @InjectRepository(ContestEntity)
    private readonly contestEntity: Repository<ContestEntity>,
    @InjectRepository(AssmContestEntity)
    private readonly AssmContestEntity: Repository<AssmContestEntity>,
    @InjectRepository(CandidateRecomendEntity)
    private readonly candidateRemEntity: Repository<CandidateRecomendEntity>,
    private readonly ascoService: AssignmentContestService,
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
  ) {}
  @Transactional()
  async create(
    createCandidateDto: CreateCandidateDto,
    idUser: string,
    file: Express.Multer.File,
    res: Response,
  ) {
    const checkCandidate = await this.candidateEntity.findOne({
      where: [
        { name: createCandidateDto.name },
        { email: createCandidateDto.email },
      ],
    });
    if (checkCandidate)
      return appErrorResponse(HttpStatus.BAD_REQUEST, CANDIDATE_EXIST, res);
    const checkUser = await this.userEntity.findOne({
      where: {
        id: idUser,
      },
    });
    if (!checkUser)
      return appErrorResponse(HttpStatus.BAD_REQUEST, USER_NOT_FOUND, res);

    const newRecomendCadidate = await this.candidateRemEntity.save({
      descs: createCandidateDto.descs,
      slogan: createCandidateDto.slogan,
    });
    const data = {
      email: createCandidateDto.email,
      name: createCandidateDto.name,
      address: createCandidateDto.address,
      background: saveImage(file),
      weight: createCandidateDto.weight,
      height: createCandidateDto.height,
      idno: createCandidateDto.idno,
      measure: createCandidateDto.measure,
      carem: newRecomendCadidate,
    };
    const newCandidate = await this.candidateEntity.save(data);
    return appResSuccess(
      newCandidate,
      ADD_CANDIDATE_SUCCESS,
      HttpStatus.CREATED,
      res,
    );
  }

  async findAll(res: Response, query: QueryDto) {
    const offset = query.page * amount - amount;

    const where = {};
    if (query.isActive !== undefined) where['isActive'] = query.isActive;
    if (query.search) {
      where['name'] = Like(`%${query.search}%`);
      where['email'] = Like(`%${query.search}%`);
    }
    const listCandidate = await this.candidateEntity.find({
      where: where,
      take: amount,
      skip: offset,
    });
    const total = await this.candidateEntity.count(where);
    const meta = {
      page: query.page,
      take: amount,
      totalPage: Math.ceil(total / amount),
    };
    return res.status(HttpStatus.OK).json({
      message: GET_LIST_CANDIDATE_SUCCESS,
      meta: meta,
      data: listCandidate,
    });
  }

  async findOne(id: string, res: Response) {
    const candidate: CandidateEntity = await this.candidateEntity
      .createQueryBuilder('ca')
      .leftJoin('ca.carem', 'carem')
      .select([
        'ca.id as id',
        'ca.idno as idno',
        'ca.name as name ',
        'ca.email as email',
        'ca.address as address',
        'ca.background as background',
        'ca.height as height',
        'ca.weight as weight',
        'ca.measure as measure',
        'ca.isActive as isActive',
        'carem.slogan as slogan',
        'carem.descs as descs',
      ])
      .where({
        id: id,
      })
      .getRawOne();

    if (!candidate)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: CANDIDATE_NOT_EXIST,
      });

    return res.status(HttpStatus.OK).json({
      message: GET_DETAIL_CANDIDATE_SUCCESS,
      candidate: candidate,
    });
  }

  async update(
    id: string,
    updateCandidateDto: UpdateCandidateDto,
    userChange: string,
    res: Response,
    file?: Express.Multer.File,
  ) {
    let flagCaUp = false;
    const checkCandidate = await this.candidateEntity.findOne({
      where: {
        id: id,
      },
    });

    if (!checkCandidate)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: CANDIDATE_NOT_EXIST,
      });

    if (!updateCandidateDto && !file)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: NOT_DATA,
      });

    if (updateCandidateDto.descs || updateCandidateDto.slogan) {
      const newCarem = {};
      if (updateCandidateDto.descs)
        newCarem['descs'] = updateCandidateDto.descs;
      if (updateCandidateDto.slogan)
        newCarem['slogan'] = updateCandidateDto.slogan;

      let carem: CandidateRecomendEntity;
      await this.candidateEntity
        .findOne({
          where: {
            id: id,
          },
          relations: {
            carem: true,
          },
        })
        .then((res) => {
          carem = res.carem;
          return;
        });

      carem = {
        ...carem,
        ...newCarem,
      };
      checkCandidate.userhistoryChange = userChange;
      await this.candidateEntity.save(checkCandidate);
      await this.candidateRemEntity.save(carem);
    }

    Object.keys(updateCandidateDto).some((key) => {
      if (key)
        if (key !== 'descs' && key !== 'slogan')
          checkCandidate[key] = updateCandidateDto[key];

      flagCaUp = true;
    });

    if (file) {
      // checkCandidate['background'] = this.saveImage(file);
      flagCaUp = true;
    }

    if (flagCaUp) {
      checkCandidate.userhistoryChange = userChange;
      await this.candidateEntity.save(checkCandidate);
    }

    return res.status(HttpStatus.OK).json({
      message: UPDATE_CANDIDATE_SUCCESS,
      candidate: checkCandidate,
    });
  }

  async remove(id: string, userChange: string) {
    try {
      const checkCaDidate = await this.validateCadidate({ id: id });

      if (!checkCaDidate) this.NotFoundError();
      else {
        checkCaDidate.isActive = false;
        checkCaDidate.historyChange = userChange;
        this.candidateEntity.save(checkCaDidate);

        return checkCaDidate;
      }
    } catch (e) {
      if (e) console.log(e);
    }
  }

  async validateCadidate(data: Validate): Promise<any> {
    const checkCadidate = await this.candidateEntity.findOneBy(data);
    return checkCadidate;
  }
  async NotFoundError() {
    return new NotFoundError('Cadidate not found');
  }
}
