import { amount } from './../../users/contants/amount.in.page';
import { UserCo } from './../../user-co/entities/user-co.entity';
import { AssmCompanyEntity } from './../../assignment-company/entities/assignment-company.entity';
import { TicketEntity } from './../../ticket/entities/ticket.entity';
import { UserCoService } from './../../user-co/services/user-co.service';
import { AssignmentCompanyService } from './../../assignment-company/service/assignment-company.service';
import { CandidateEntity } from './../../candidate/entities/candidate.entity';
import { TicketService } from './../../ticket/services/ticket.service';
import { SERVE_ERROR } from './../../common/constant/message';
import { FIELD_NOT_HOLLOW } from './../../users/contants/message';
import {
  CONTEST_NOT_FOUND,
  COMPANY_NOT_EXIST,
  COMPANY_NOT_ACTIVE,
} from './../../assignment-company/contants/contant';
import { CompanyEntity } from 'src/company/entities/company.entity';
import { plainToClass } from 'class-transformer';
import { ContestEntity } from './../entities/contest.entity';
import { Injectable, HttpStatus, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateContestDto } from '../dto/create-contest.dto';
import { UpdateContestDto } from '../dto/update-contest.dto';
import { In, Repository } from 'typeorm';
import { Validate } from 'src/common/class/validate.entity';
import { CompanyService } from 'src/company/services/company.service';
import * as fs from 'fs';
import { Response } from 'express';
import {
  ADD_CONTEST_SUCCES,
  ADM_MESSAGE,
  ASSCP_NOT_FOUND,
  COMPANY_ERROR,
  CONTEST_EXISTING,
  CO_REM_NOT_EXIST,
  GET_DETAILS_SUCESS,
  GET_LIST_CONTEST_SUCCESS,
  NOT_DATA,
  UPDATE_SUCCESS,
} from '../contants/contants';
import { ContestRecomendEntity } from '../entities/ContestRecomend.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { UserCp } from 'src/user-cp/entities/user-cp.entity';

@Injectable()
export class ContestService {
  constructor(
    @InjectRepository(ContestEntity)
    private readonly contentEntity: Repository<ContestEntity>,
    @InjectRepository(ContestRecomendEntity)
    private readonly contestRemEntity: Repository<ContestRecomendEntity>,
    @InjectRepository(AssmCompanyEntity)
    private readonly assmCompanyEntity: Repository<AssmCompanyEntity>,
    @InjectRepository(CompanyEntity)
    private readonly companyEntity: Repository<CompanyEntity>,
    @InjectRepository(CandidateEntity)
    private readonly candidateEntity: Repository<CandidateEntity>,
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
    private readonly companyService: CompanyService,
    private readonly ticketService: TicketService,
    private readonly ascpService: AssignmentCompanyService,
    private readonly ucoService: UserCoService,
  ) {}
  async create(
    createContestDto: CreateContestDto,
    file: Express.Multer.File,
    userCreate: string,
    res: Response,
  ) {
    try {
      const checkContest = await this.contentEntity.findOne({
        where: [
          { email: createContestDto.email },
          { name: createContestDto.name },
        ],
      });

      if (checkContest) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: CONTEST_EXISTING,
        });
      } else {
        const newInfoCo = {
          name: createContestDto.name,
          address: createContestDto.address,
          email: createContestDto.email,
          historyCreate: userCreate,
        };

        if (file) {
          newInfoCo['background'] = this.saveImage(file);
        }

        newInfoCo['historyCreate'] = userCreate;
        const newContest = await this.contentEntity.save({ ...newInfoCo });

        if (newContest) {
          const infoRem = {
            desc: createContestDto.description,
            slogan: createContestDto.slogan,
          };
          const newCoRem = await this.contestRemEntity.save(infoRem);
          if (newCoRem) {
            newContest.coRem = newCoRem;
            await this.contentEntity.save(newContest);
          } else {
          }
          let listTicket;
          let listAscp;
          let listUco;

          console.log('check 1');

          if (createContestDto.share.listIdCompany) {
            const checkCompanies = await this.companyEntity.find({
              where: {
                id: In(createContestDto.share.listIdCompany),
              },
            });
            if (checkCompanies.length > 0) {
              const infoListAscp = {
                idContest: newContest.id,
                idCompanies: createContestDto.share.listIdCompany,
              };
              const resAscp = await this.ascpService.create(infoListAscp);
              listAscp = resAscp.data;
            }
          }
          if (createContestDto.share.listIdCandidate) {
            const checkCandidates = await this.candidateEntity.find({
              where: {
                id: In(createContestDto.share.listIdCandidate),
              },
            });
            if (checkCandidates.length > 0) {
              const infoListTicket = {
                idcontest: newContest.id,
                idcandidates: createContestDto.share.listIdCandidate,
                historyCreate: userCreate,
              };
              const resTicket = await this.ticketService.create(
                infoListTicket,
                userCreate,
              );
              listTicket = resTicket.data;
            }
          }

          if (createContestDto.share.listIdUser) {
            const checkUsers = await this.userEntity.find({
              where: {
                id: In(createContestDto.share.listIdUser),
              },
            });
            if (checkUsers.length > 0) {
              const infoListUco = {
                idContest: newContest.id,
                idUsers: createContestDto.share.listIdUser,
              };
              const resUco = await this.ucoService.create(infoListUco);
              listUco = resUco.data;
            }
          }

          return res.status(HttpStatus.CREATED).json({
            message: ADD_CONTEST_SUCCES,
            listTicket: listTicket,
            listAscp: listAscp,
            listUco: listUco,
            newContest: newContest,
          });
        } else {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: ADM_MESSAGE,
          });
        }
      }
    } catch (e) {
      if (e) console.log(e);
    }
  }

  async findAll(res: Response, page: number, query: any) {
    const offset = page * amount - amount;
    const total = await this.contentEntity.count();
    if (query.search) {
      const listContest = await this.contentEntity
        .createQueryBuilder('co')
        .leftJoin('co.coRem', 'corem')
        .where('co.coRemId = corem.id')
        .andWhere('co.name =:name', { name: query.search })
        .andWhere('co.email =:email', { email: query.search })
        .select('co')
        .offset(offset)
        .limit(amount)
        .getMany();
      return res.status(HttpStatus.OK).json({
        message: GET_LIST_CONTEST_SUCCESS,
        list: listContest,
        total: total,
      });
    }

    if (query.isActive) {
      const listContest = await this.contentEntity
        .createQueryBuilder('co')
        .leftJoin('co.coRem', 'corem')
        .where('co.coRemId = corem.id')
        .andWhere('co.isActive =:isActive', { isActive: query.isActive })
        .select('co')
        .offset(offset)
        .limit(amount)
        .getMany();
      return res.status(HttpStatus.OK).json({
        message: GET_LIST_CONTEST_SUCCESS,
        list: listContest,
        total: total,
      });
    }

    const listContest = await this.contentEntity
      .createQueryBuilder('co')
      .leftJoin('co.coRem', 'corem')
      .where('co.coRemId = corem.id')
      .select('co')
      .offset(offset)
      .limit(amount)
      .getMany();

    return res.status(HttpStatus.OK).json({
      message: GET_LIST_CONTEST_SUCCESS,
      list: listContest,
      total: total,
    });
  }

  async findOne(id: string) {
    const checkContest = await this.validateContest({ id: id });

    return checkContest;
  }

  async update(
    id: string,
    updateContestDto: UpdateContestDto,
    userChange: string,
    res: Response,
    file?: Express.Multer.File,
  ) {
    const checkContest = await this.contentEntity.findOne({
      where: {
        id: id,
      },
      relations: {
        coRem: true,
      },
    });

    if (!checkContest)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: CONTEST_NOT_FOUND,
      });

    if (!updateContestDto && !file) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: NOT_DATA,
      });
    }

    const coUpdate = {
      name: updateContestDto.name,
      address: updateContestDto.address,
      email: updateContestDto.email,
      isActive: updateContestDto.isActive,
    };

    const coRem = {
      slogan: updateContestDto.slogan,
      descs: updateContestDto.descs,
    };

    const idNewCp = updateContestDto.idCompany;
    let checkCompany: CompanyEntity;

    if (idNewCp) {
      checkCompany = await this.companyEntity.findOne({
        where: {
          id: idNewCp,
        },
      });
      if (!checkCompany) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: COMPANY_NOT_EXIST,
        });
      }
      if (!checkCompany.isActive) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: COMPANY_NOT_ACTIVE,
        });
      }
    }
    if (checkCompany) {
      const assmCp = await this.assmCompanyEntity.findOne({
        where: {
          contest: checkContest,
        },
      });

      if (!assmCp) {
        return res.status(HttpStatus.BAD_GATEWAY).json({
          message: ASSCP_NOT_FOUND,
        });
      }

      if (assmCp) {
        const updateCp = await this.companyEntity.findOne({
          where: {
            id: updateContestDto.idCompany,
          },
        });

        if (!updateCp)
          return res.status(HttpStatus.NOT_FOUND).json({
            message: COMPANY_NOT_EXIST,
          });

        assmCp.company = updateCp;
        await this.assmCompanyEntity.save(assmCp);
      }
    }

    if (coRem.descs || coRem.slogan) {
      const corem = await this.contestRemEntity.findOne({
        where: {
          id: checkContest.coRem.id,
        },
      });
      Object.keys(coRem).some((key) => {
        if (coRem[key]) {
          corem[key] = coRem[key];
        }
      });

      await this.contestRemEntity.save(corem);
    }

    let flagContest = false;

    Object.keys(coUpdate).some((key) => {
      if (coUpdate[key] !== '' && coUpdate[key] !== undefined) {
        flagContest = true;
        checkContest[key] = coUpdate[key];
      }
    });

    if (file) {
      checkContest['background'] = this.saveImage(file);
      flagContest = true;
    }

    if (flagContest) {
      await this.contentEntity.save(checkContest);
    }

    return res.status(HttpStatus.OK).json({
      message: UPDATE_SUCCESS,
    });
  }

  async remove(id: string, userRemove: string) {
    try {
      const checkContest = await this.validateContest({ id: id });

      if (!checkContest) return 'Contest not existing';
      else {
        if (checkContest.isActive == false) return 'Contest was stop';
        else {
          checkContest.userhistoryChange = userRemove;
          checkContest.isActive = false;
          this.contentEntity.save(checkContest);
          return checkContest;
        }
      }
    } catch (e) {
      if (e) console.log(e);
    }
  }

  async getContestByIdCompany(id: string) {
    try {
      const listContest = await this.contentEntity.find({
        relations: {},
      });

      return listContest;
    } catch (e) {
      if (e) console.log(e);
    }
  }

  async validateContest(data: Validate): Promise<any> {
    const checkContest = await this.contentEntity.findOneBy(data);
    return checkContest;
  }

  async save(data: ContestEntity) {
    try {
      this.contentEntity.save(data);
    } catch (e) {
      if (e) console.log(e);
    }
  }

  async createNewContest(data, file) {
    try {
      const filename = file.filename;
      const path = file.path;
      const type = file.mimetype.split('/').pop().toLowerCase();
      const fileSave = `${filename}${Date.now()}.${type}`;
      const buffer = fs.readFileSync(file.path);
      fs.writeFileSync(`./data/${fileSave}`, buffer);
      fs.unlinkSync(path);
      const newData = {
        ...data,
        background: fileSave,
      };

      const checkContest = await this.validateContest({ email: newData.email });

      if (checkContest) return 'Contest existing';
      else {
        const newContest = await this.contentEntity.save(newData);
        return newContest;
      }
    } catch (e) {
      if (e) console.log(e);
    }
  }

  private saveImage(file: Express.Multer.File) {
    const filename = file.filename;
    const path = file.path;
    const type = file.mimetype.split('/').pop().toLowerCase();
    const fileSave = `${process.env.STATICIMG + filename}${Date.now()}.${type}`;
    const buffer = fs.readFileSync(file.path);
    fs.writeFileSync(`.${fileSave}`, buffer);
    fs.unlinkSync(path);
    return fileSave;
  }

  async getDetailsContest(id: string, res: Response) {
    const contest = await this.contentEntity
      .createQueryBuilder('co')
      .leftJoin('co.coRem', 'corem')
      .leftJoin(AssmCompanyEntity, 'ascp', 'co.id = ascp.contestId')
      .leftJoin('ascp.company', 'cp')
      .select([
        'co.name as name',
        'co.isActive as isActive',
        'co.address as  address',
        'co.email as email',
        'co.background as background',
        'slogan',
        'descs',
        'cp.name as company',
      ])
      .where({
        id: id,
      })
      .getRawOne();

    if (!contest)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: CONTEST_NOT_FOUND,
      });

    return res.status(HttpStatus.OK).json({
      contest: contest,
    });
  }
  async findTest(data, res: Response) {
    const listContests = await this.contentEntity.find({
      where: {
        id: In(data),
      },
    });
    return res.status(HttpStatus.OK).json({
      list: listContests,
    });
  }
}
