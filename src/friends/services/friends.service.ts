import { amount } from './../../users/contants/amount.in.page';
import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendsEntity } from '../entities/fiends.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Raw, Repository } from 'typeorm';
import { Response } from 'express';
import { CreateFriendDto } from '../dto/create-friend.dto';
import { USER_NOT_FOUND } from 'src/users/contants/message';
import {
  ADD_NEW_FRIEND_SUCCESS,
  CANCEL_FRIEND_SUCCESS,
  FRIEND_EXIST,
  GET_UNKNOW_PEOPLE_SUCCESS,
  THEY_NOT_FRIEND,
} from 'src/common/constant/message';
import { ParamGetFriendsDto } from '../dto/param-get-friends.dto';
@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(FriendsEntity)
    private readonly friendsEntity: Repository<FriendsEntity>,
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
  ) {}
  async addFriend(res: Response, data: CreateFriendDto) {
    const checkUser = await this.userEntity.findOne({
      where: {
        id: data.idUser,
      },
    });
    const checkReveice = await this.userEntity.findOne({
      where: {
        id: data.idReveice,
      },
    });

    if (!checkUser || !checkReveice)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: USER_NOT_FOUND,
      });

    let checkFriend = await this.friendsEntity.findOne({
      where: {
        author: checkUser,
        reveice: checkReveice,
      },
    });

    let checkFriendReveice = await this.friendsEntity.findOne({
      where: {
        author: checkReveice,
        reveice: checkUser,
      },
    });
    if (checkFriend || checkFriendReveice)
      return res.status(HttpStatus.CONFLICT).json({
        message: FRIEND_EXIST,
      });
    if (!checkFriend && !checkFriendReveice) {
      let newFriends = await this.friendsEntity.save({
        author: checkUser,
        reveice: checkReveice,
      });

      return res.status(HttpStatus.CREATED).json({
        message: ADD_NEW_FRIEND_SUCCESS,
        friend: newFriends,
      });
    }
  }

  async getFriends(
    res: Response,
    idUser: string,
    { take = 8, page = 1, search }: ParamGetFriendsDto,
  ) {
    let skip = take * page - take;

    let checkUser = await this.userEntity.findOne({
      where: {
        id: idUser,
      },
    });

    if (!checkUser)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: USER_NOT_FOUND,
      });

    let checkFriends: FriendsEntity[] = await this.friendsEntity.find({
      where: [{ author: checkUser }, { reveice: checkUser }],
      relations: {
        author: true,
        reveice: true,
      },
      take: take,
      skip: skip,
    });
    let friends: UserEntity[] = [];
    if (!search) {
      friends = checkFriends.map((e, index) => {
        if (e.author.id !== checkUser.id) return e.author;
        if (e.reveice.id !== checkUser.id) return e.reveice;
      });
    } else {
      checkFriends.map((e, index) => {
        if (
          e.author.id !== checkUser.id &&
          e.author.username.includes(search)
        ) {
          friends.push(e.author);
        }
        if (
          e.reveice.id !== checkUser.id &&
          e.reveice.username.includes(search)
        ) {
          friends.push(e.reveice);
        }
      });
    }

    return res.status(HttpStatus.OK).json({
      message: 'OK',
      friends: friends,
    });
  }

  async cancelFriend(res: Response, id: string, idUser: string) {
    let checkUser = await this.userEntity.findOne({
      where: {
        id: idUser,
      },
    });
    let checkFriend = await this.userEntity.findOne({
      where: {
        id: id,
      },
    });
    if (!checkUser || !checkFriend)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: USER_NOT_FOUND,
      });
    let checkAuthor = await this.friendsEntity.findOne({
      where: {
        author: checkUser,
        reveice: checkFriend,
      },
    });
    let checkReveice = await this.friendsEntity.findOne({
      where: {
        author: checkFriend,
        reveice: checkUser,
      },
    });

    if (!checkAuthor && !checkReveice)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: THEY_NOT_FRIEND,
      });

    if (checkReveice) {
      checkReveice.isActive = false;
      await this.friendsEntity.save(checkReveice);
    }
    if (checkAuthor) {
      checkAuthor.isActive = false;
      await this.friendsEntity.save(checkAuthor);
    }
    return res.status(HttpStatus.OK).json({
      message: CANCEL_FRIEND_SUCCESS,
    });
  }
  async getUnknowPeoples(res: Response, id: string, { page }: any) {
    let skip = amount * page - amount;
    let checkUser = await this.userEntity.findOne({
      where: {
        id: id,
      },
    });
    if (!checkUser)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: USER_NOT_FOUND,
      });

    let friends = await this.friendsEntity.find({
      where: [{ author: checkUser }, { reveice: checkUser }],
      relations: {
        author: true,
        reveice: true,
      },
    });
    let idsFriend = friends.map((e, index) => {
      if (e.author.id !== id) return e.author.id;
      else e.reveice.id !== id;
      return e.reveice.id;
    });
    idsFriend.push(id);
    let unknowPeople = await this.userEntity.find({
      where: {
        id: Raw((id) => `${id} not in (:...ids)`, { ids: idsFriend }),
      },
      take: amount,
      skip: skip,
    });
    return res.status(HttpStatus.OK).json({
      message: GET_UNKNOW_PEOPLE_SUCCESS,
      data: unknowPeople,
    });
  }
}
