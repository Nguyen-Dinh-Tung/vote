import {
  ADD_NEW_UCO_SUCCESS,
  SERVE_ERROR,
} from './../../common/constant/message';
import { SEARCH_KEY_NOT_FOUNT } from './../../candidate/contants/message';
import { ContestEntity } from 'src/contest/entities/contest.entity';
import {
  COMPANY_ERROR,
  GET_LIST_CONTEST_SUCCESS,
  NOT_DATA,
} from './../../contest/contants/contants';
import { CompanyService } from './../../company/services/company.service';
import { ContestService } from 'src/contest/services/contest.service';
import { AssmCompanyEntity } from './../entities/assignment-company.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAssignmentCompanyDto } from '../dto/create-assignment-company.dto';
import { UpdateAssignmentCompanyDto } from '../dto/update-assignment-company.dto';
import { In, Repository } from 'typeorm';
import { Response } from 'express';
import {
  ADD_NEW_ASSIGNMENT_SUCCESS,
  ASSM_CP_NOT_FOUND,
  COMPANY_NOT_ACTIVE,
  COMPANY_NOT_EXIST,
  CONFLIT_ASSIGNMENT,
  CONTEST_NOT_ACTIVE,
  CONTEST_NOT_FOUND,
  REMOVE_ASCP_SUCCESS,
  UPDATE_ASSM_COMPANY,
} from '../contants/contant';
import { CompanyEntity } from 'src/company/entities/company.entity';
import { FindList } from 'src/common/interfaces/res.interfaces';

@Injectable()
export class AssignmentCompanyService {
  constructor(
    @InjectRepository(AssmCompanyEntity)
    private readonly assigmCompany: Repository<AssmCompanyEntity>,
    @InjectRepository(ContestEntity)
    private readonly contestEntity: Repository<ContestEntity>,
    @InjectRepository(CompanyEntity)
    private readonly companyEntity: Repository<CompanyEntity>,
  ) {}
  async create(
    createAssignmentCompanyDto: CreateAssignmentCompanyDto,
  ): Promise<FindList<AssmCompanyEntity>> {
    const checkCompanies = await this.companyEntity.find({
      where: {
        id: In(createAssignmentCompanyDto.idCompanies),
      },
    });

    const checkContest = await this.contestEntity.findOne({
      where: {
        id: createAssignmentCompanyDto.idContest,
      },
    });
    if (checkCompanies.length < 1)
      return {
        message: COMPANY_NOT_EXIST,
        status: HttpStatus.NOT_FOUND,
        data: undefined,
        total: undefined,
        failList: undefined,
      };
    if (!checkContest)
      return {
        message: CONTEST_NOT_FOUND,
        status: HttpStatus.NOT_FOUND,
        data: undefined,
        total: undefined,
        failList: undefined,
      };
    const listAscp = [];
    for (const e of checkCompanies) {
      const infoNewAscp = {
        company: e,
        contest: checkContest,
      };

      const newAscp = await this.assigmCompany.save(infoNewAscp);
      console.log(newAscp);

      if (newAscp) listAscp.push(newAscp);
    }
    return {
      message: ADD_NEW_UCO_SUCCESS,
      status: HttpStatus.OK,
      data: listAscp,
      total: listAscp.length,
      failList: undefined,
    };
  }

  async findAll(
    res: Response,
    page: number,
    id: string,
    isActive?: boolean,
    search?: string,
  ) {
    if (search !== undefined) {
      const listAssContest = await this.assigmCompany
        .createQueryBuilder('ascp')
        .leftJoin('ascp.contest', 'co')
        .leftJoin('ascp.company', 'cp')
        .where('co.name =:name', { name: search })
        .andWhere('ascp.isActive = true')
        .select([
          'co.id as id',
          'co.name as name',
          'co.address as address',
          'co.email as email',
          'co.isActive as isActive',
          'co.background as background',
          'cp.name as company',
        ])
        .getRawMany();

      if (listAssContest.length > 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: GET_LIST_CONTEST_SUCCESS,
          listContest: listAssContest,
          total: listAssContest.length,
        });
      }
      return res.status(HttpStatus.OK).json({
        message: SEARCH_KEY_NOT_FOUNT,
      });
    }

    if (isActive !== undefined) {
      const listAssContest = await this.assigmCompany
        .createQueryBuilder('ascp')
        .leftJoin('ascp.contest', 'co')
        .leftJoin('ascp.company', 'cp')
        .where('cp.id =:id', { id: id })
        .andWhere('ascp.isActive = true')
        .select([
          'co.id as id',
          'co.name as name',
          'co.address as address',
          'co.email as email',
          'co.isActive as isActive',
          'co.background as background',
          'cp.name as company',
        ])
        .getRawMany();
      if (listAssContest.length > 0) {
        return res.status(HttpStatus.OK).json({
          message: GET_LIST_CONTEST_SUCCESS,
          listContest: listAssContest,
          total: listAssContest.length,
        });
      }

      return res.status(HttpStatus.NOT_FOUND).json({
        message: NOT_DATA,
      });
    }

    const listAssContest = await this.assigmCompany
      .createQueryBuilder('ascp')
      .leftJoin('ascp.contest', 'co')
      .leftJoin('ascp.company', 'cp')
      .where('cp.id =:id', { id: id })
      .andWhere('ascp.isActive = true')
      .select([
        'co.id as id',
        'co.name as name',
        'co.address as address',
        'co.email as email',
        'co.isActive as isActive',
        'co.background as background',
        'cp.name as company',
      ])
      .getRawMany();
    return res.status(HttpStatus.OK).json({
      message: GET_LIST_CONTEST_SUCCESS,
      listContest: listAssContest,
      total: listAssContest.length,
    });
  }

  async removeAscp(id: string, listId: string[], res: Response) {
    const checkCp = await this.companyEntity.findOne({
      where: {
        id: id,
      },
    });

    if (!checkCp)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: COMPANY_NOT_EXIST,
      });

    const checkListContest = await this.contestEntity.find({
      where: {
        id: In(listId),
      },
    });

    if (checkListContest.length !== listId.length)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: CONTEST_NOT_FOUND,
      });

    const listAscp = await this.assigmCompany
      .createQueryBuilder('ascp')
      .leftJoin(ContestEntity, 'co', 'co.id = ascp.contestId')
      .leftJoin(CompanyEntity, 'cp', 'cp.id = ascp.companyId')
      .where('co.id in :listId', { listId: listId })
      .where('cp.id = :id', { id: id })
      .select('ascp')
      .getMany();

    if (listAscp.length !== listId.length)
      return res.status(HttpStatus.BAD_GATEWAY).json({
        message: SERVE_ERROR,
      });

    for (const e of listAscp) {
      e.isActive = false;
      await this.assigmCompany.save(e);
    }

    return res.status(HttpStatus.OK).json({
      message: REMOVE_ASCP_SUCCESS,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} assignmentCompany`;
  }

  async update(
    id: string,
    updateAssignmentCompanyDto: UpdateAssignmentCompanyDto,
    res: Response,
  ) {
    const checkAssmCp = await this.assigmCompany.findOne({
      where: {
        id: id,
      },
    });

    if (!checkAssmCp)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: ASSM_CP_NOT_FOUND,
      });

    if (updateAssignmentCompanyDto.isActive)
      checkAssmCp.isActive = updateAssignmentCompanyDto.isActive;

    if (updateAssignmentCompanyDto.idCompany) {
      const idCompany = updateAssignmentCompanyDto.idCompany;
      const checkCompany = await this.companyEntity.findOne({
        where: {
          id: idCompany,
        },
      });

      if (!checkCompany)
        return res.status(HttpStatus.NOT_FOUND).json({
          message: COMPANY_NOT_EXIST,
        });
      checkAssmCp.company = checkCompany;
    }

    await this.assigmCompany.save(checkAssmCp);

    return res.status(HttpStatus.OK).json({
      message: UPDATE_ASSM_COMPANY,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} assignmentCompany`;
  }
}
