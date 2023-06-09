import { NOT_DATA } from './../../contest/contants/contants';
import {
  ADDRESS_NOT_FOUND,
  EMAIL_FORMAT,
  EMAIL_NOT_FOUND,
  MESSAGE_FORMAT,
  NAME_NOT_FOUND,
  USERNAME_NOT_FORMAT,
  UPDATE_SUCCESS,
  FIELD_NOT_HOLLOW,
  EMAIL_UNIQUE,
} from './../contants/message';
import { Response } from 'express';
import { UserEntity } from './../entities/user.entity';
import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Validate } from 'src/common/class/validate.entity';
import { MessageUpdate } from 'src/common/constant/message';
import {
  GET_USER,
  PASSWORD_NOT_FOUND,
  USER_CREATE,
  USER_DUBLICATE,
  USER_NOT_EXISTING_SYSTEM,
  USER_NOT_FOUND,
  USER_REMOVE,
} from '../contants/message';
import * as fs from 'fs';
import { regexEmail, regexPassword, regexUsername } from 'src/regex/regex';
import { amount } from '../contants/amount.in.page';
import {
  SEARCH_KEY_NOT_FOUNT,
  SEARCH_SUCCESS,
  GET_LIST_CANDIDATE_SUCCESS,
  FILTER_SUCCESS,
  FILTER_FAIL,
} from 'src/candidate/contants/message';
import { Transactional } from 'typeorm-transactional';
import { IoEntity } from 'src/io/entities/io.entity';
import { IoServices } from 'src/io/services/io.service';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
    @InjectRepository(IoEntity) private readonly ioEntity: Repository<IoEntity>,
    private readonly ioService: IoServices,
  ) {}

  @Transactional()
  async create(
    createUserDto: CreateUserDto,
    userCreated?: string,
    file?: Express.Multer.File,
    res?: Response,
  ) {
    const checkUserEmail = await this.validateUser({
      email: createUserDto.email,
    });
    const checkUserByUsername = await this.validateUser({
      username: createUserDto.username,
    });

    if (checkUserEmail || checkUserByUsername) {
      return res.status(HttpStatus.CONFLICT).json({
        message: USER_DUBLICATE,
      });
    } else {
      if (file) {
        const fileSave = this.saveImage(file);
        createUserDto.background = fileSave;
      }

      if (createUserDto.username) {
        if (!regexUsername(createUserDto.username)) {
          return res.status(HttpStatus.NOT_FOUND).json({
            message: USERNAME_NOT_FORMAT,
          });
        }
      }

      if (createUserDto.email) {
        if (!regexEmail(createUserDto.email)) {
          return res.status(HttpStatus.NOT_FOUND).json({
            message: EMAIL_FORMAT,
          });
        }
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: EMAIL_NOT_FOUND,
        });
      }

      if (createUserDto.name === '') {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: NAME_NOT_FOUND,
        });
      }

      if (createUserDto.address === '') {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: ADDRESS_NOT_FOUND,
        });
      }

      createUserDto.historyCreate = userCreated;
      createUserDto.password = bcrypt.hashSync(
        createUserDto.password,
        Number(process.env.HASHKEY),
      );
      const user = await this.userEntity.save(createUserDto);

      if (user) {
        await this.ioService.createSocketConnect(
          {
            idUser: user.id,
          },
          res,
        );
      }

      return res.status(HttpStatus.CREATED).json({
        message: USER_CREATE,
        newUser: user,
      });
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

  async findAll(res: Response) {
    const listUser = await this.userEntity.find();

    if (listUser.length < 1) {
      return res.status(HttpStatus.OK).json({
        message: USER_NOT_EXISTING_SYSTEM,
      });
    }

    return res.status(HttpStatus.OK).json({
      listUser: listUser,
    });
  }

  async findOne(id: string, res: Response): Promise<UserEntity | any> {
    const checkUser = await this.validateUser({ id: id });

    if (!checkUser) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: USER_NOT_FOUND,
      });
    } else {
      return res.status(HttpStatus.OK).json({
        message: GET_USER,
        user: checkUser,
      });
    }
  }

  async searchList(
    search?: string,
    isActive?: boolean,
    page?: number,
    res?: Response,
  ): Promise<Response<UserEntity>> {
    const offset = +page * amount - amount;

    let listUser: any[];
    const total = await this.userEntity.findAndCount();

    if (search) {
      listUser = await this.userEntity
        .createQueryBuilder('user')
        .where(`user.username like "%${search}%"`)
        .orWhere(`user.name like "%${search}%"`)
        .select([
          'user.id as id',
          'user.name as name',
          'user.background as background',
          'user.username as username',
          'user.email as email',
          'user.address as address',
          'user.isActive as isActive',
          'user.role as role',
        ])
        .limit(amount)
        .offset(offset)
        .getRawMany();

      if (listUser.length > 0) {
        return res.status(HttpStatus.OK).json({
          message: SEARCH_SUCCESS,
          listUser: listUser,
          total: total[1],
        });
      }
      return res.status(HttpStatus.NOT_FOUND).json({
        message: SEARCH_KEY_NOT_FOUNT,
        listUser: listUser,
      });
    }

    if (isActive !== undefined) {
      listUser = await this.userEntity
        .createQueryBuilder('user')
        .where(`user.isActive = ${isActive}`)
        .select([
          'user.id as id',
          'user.name as name',
          'user.background as background',
          'user.username as username',
          'user.email as email',
          'user.address as address',
          'user.isActive as isActive',
          'user.role as role',
        ])
        .limit(amount)
        .offset(offset)
        .getRawMany();

      if (listUser.length > 0) {
        return res.status(HttpStatus.OK).json({
          message: FILTER_SUCCESS,
          listUser: listUser,
          total: total[1],
        });
      }
      return res.status(HttpStatus.NOT_FOUND).json({
        message: FILTER_FAIL,
        listUser: listUser,
        total: listUser.length,
      });
    }

    if (isActive === undefined && search === undefined) {
      listUser = await this.userEntity
        .createQueryBuilder('user')
        .select('user')
        .limit(amount)
        .offset(offset)
        .getMany();
    }

    if (listUser.length < 1)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: NOT_DATA,
      });
    return res.status(HttpStatus.OK).json({
      message: GET_LIST_CANDIDATE_SUCCESS,
      listUser: listUser,
      total: total[1],
    });
  }
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    userUpdate: string,
    res: Response,
    file?: Express.Multer.File,
  ) {
    try {
      let checkUser = await this.validateUser({ id: id });

      if (!checkUser) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: USER_NOT_FOUND,
        });
      } else {
        Object.keys(updateUserDto).some((key) => {
          if (updateUserDto[key] === '') {
            res.status(HttpStatus.NOT_FOUND).json({
              message: FIELD_NOT_HOLLOW,
            });
          }
        });

        if (updateUserDto.email) {
          if (updateUserDto.email != checkUser.email) {
            const checkEmail = await this.validateUser({
              email: updateUserDto.email,
            });
            if (checkEmail)
              return res.status(HttpStatus.NOT_FOUND).json({
                message: EMAIL_UNIQUE,
              });
          }
        }

        if (updateUserDto['newPassword'] || updateUserDto['oldPassword']) {
          if (!updateUserDto['newPassword'] || !updateUserDto['oldPassword']) {
            return res.status(HttpStatus.NOT_FOUND).json({
              message: PASSWORD_NOT_FOUND,
            });
          }
        }

        if (updateUserDto.oldPassword && updateUserDto.newPassword) {
          if (updateUserDto.oldPassword === updateUserDto.newPassword) {
            return res.status(HttpStatus.CONFLICT).json({
              message: MessageUpdate.PASSWORD_DUPLICATE,
            });
          }
          if (!regexPassword(updateUserDto.newPassword)) {
            return res.status(HttpStatus.NOT_FOUND).json({
              message: MESSAGE_FORMAT,
            });
          }

          const compePassword = bcrypt.compareSync(
            updateUserDto.oldPassword,
            checkUser.password,
          );

          if (compePassword) {
            const newPassword = bcrypt.hashSync(updateUserDto.newPassword, 10);
            checkUser = {
              ...checkUser,
              passowrd: newPassword,
              historyChange: userUpdate,
            };
            if (file) {
              checkUser['background'] = this.saveImage(file);
            }
            await this.userEntity.save(checkUser);
            return res.status(HttpStatus.OK).json({
              message: UPDATE_SUCCESS,
              user: checkUser,
            });
          } else {
            return res.status(HttpStatus.BAD_REQUEST).json({
              message: MessageUpdate.PASSWORD_OLD_NOT_CORRECT,
            });
          }
        }

        if (file) {
          checkUser['background'] = this.saveImage(file);
        }

        checkUser = { ...checkUser, ...updateUserDto };
        await this.userEntity.save(checkUser);

        return res.status(HttpStatus.OK).json({
          message: UPDATE_SUCCESS,
          user: checkUser,
        });
      }
    } catch (e) {
      if (e) console.log(e);
    }
  }

  async remove(id: string, userRemove: string, res: Response) {
    try {
      let checkUser = await this.validateUser({ id: id });
      const newData = { isActive: false, historyChange: userRemove };

      if (!checkUser) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: USER_NOT_FOUND,
        });
      } else {
        checkUser = {
          ...checkUser,
          ...newData,
        };
        await this.userEntity.save(checkUser);
        return res.status(HttpStatus.OK).json({
          message: USER_REMOVE,
        });
      }
    } catch (e) {
      if (e) console.log(e);
    }
  }

  async createAdminUser(createUserDto: CreateUserDto) {
    const checkUser = await this.validateUser({ email: 'admin@gmail.com' });

    if (checkUser) {
      return false;
    } else {
      createUserDto.password = bcrypt.hashSync(createUserDto.password, 10);
      const user = await this.userEntity.save(createUserDto);
      let newIo: IoEntity;
      if (user) newIo = await this.ioEntity.save({});

      user.io = newIo;
      await this.userEntity.save(user);
      return user;
    }
  }

  async validateUser(data: Validate): Promise<any> {
    const checkUser = await this.userEntity.findOneBy(data);

    return checkUser;
  }
}
