import { RoomsDataService } from './../../rooms-data/services/rooms-data.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { RoomsDataEntity } from './../../rooms-data/entities/rooms-data.entity';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { ConnectedSocket } from '@nestjs/websockets/decorators';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets/interfaces';
import { Server } from 'socket.io';
import jwtDecode from 'jwt-decode';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IoServices } from 'src/io/services/io.service';
import { IoEntity } from 'src/io/entities/io.entity';
import { PrivateChatDto } from '../dto/private-chat.dto';
import { RoomEntity } from 'src/rooms/entities/rooms.entity';
import { ConnectIoEntity } from 'src/io/entities/connect-io.entity';
import { Socket } from 'socket.io';
import { Res } from '@nestjs/common';
import { Response } from 'express';

@WebSocketGateway({ name: 'chats', cors: true })
export class GateWay
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(
    @InjectRepository(IoEntity) private readonly ioEntity: Repository<IoEntity>,
    private readonly ioServices: IoServices,
    @InjectRepository(RoomEntity)
    private readonly roomEntity: Repository<RoomEntity>,
    @InjectRepository(ConnectIoEntity)
    private readonly cnsEntity: Repository<ConnectIoEntity>,
    private readonly roomDataService: RoomsDataService,
  ) {}
  @WebSocketServer()
  private readonly server: Server;

  @SubscribeMessage('events')
  onEvents(@MessageBody() data: string, @ConnectedSocket() client: any) {}

  @SubscribeMessage('chat')
  async privateChat(@MessageBody() data: any, @ConnectedSocket() client: any) {
    const ioIdReceive = await this.ioServices.privateChat(data.idUser);

    client.to(ioIdReceive.socketId).emit('chat', data.message);
  }
  @SubscribeMessage('private-chat')
  async privateChatHandle(
    @MessageBody() data: any,
    @ConnectedSocket() client: any,
  ) {
    const idEmit = client.id;
    const idRoom = data.idRoom;

    const reveiceId = await this.ioEntity
      .createQueryBuilder('io')
      .where('io.socketId <> :idSocket', { idSocket: idEmit })
      .leftJoin(ConnectIoEntity, 'cns', 'cns.ioId = io.id')
      .leftJoin('cns.room', 'rooms')
      .andWhere('rooms.id =:id', { id: idRoom })
      .select('io')
      .getOne();

    const newMessage = {
      message: data.message,
      roomId: idRoom,
      idUser: data.idUser,
      file: data.file,
    };

    const res = await this.roomDataService.insertNewMessage(newMessage);
    if (res.status === true) {
      this.server
        .to(reveiceId.socketId)
        .emit('reveice-private-chat', { roomId: idRoom });
      this.server
        .to(client.id)
        .emit('reveice-private-chat', { roomId: idRoom });
    }
  }
  @SubscribeMessage('join-room')
  privateRoom(@MessageBody() data: string, @ConnectedSocket() client: any) {}

  public async handleConnection(client: any, ...args: any[]) {
    try {
      let token: any;
      if (client.handshake.auth.token)
        token = jwtDecode(client.handshake.auth.token);

      let idUser: string;
      if (token) idUser = token.idUser;

      const idSocket: string = client.id;

      const infoConnect = {
        idUser: idUser,
        ioId: idSocket,
        isOnline: true,
      };

      const group = await this.ioServices.connect(infoConnect);
      for (const e of group) {
        client.join(e.id);
      }
      this.server.emit('user-connect', true);
      return this.server.to(client.id).emit('online', { connect: true });
    } catch (e) {
      if (e) console.log(e);
    }
  }
  public async handleDisconnect(client: any) {
    try {
      let token: any;
      if (client.handshake.auth.token)
        token = jwtDecode(client.handshake.auth.token);

      let idUser: string;
      if (token) idUser = token.idUser;

      const idSocket: string = client.id;

      const infoDisconnect = {
        idUser: idUser,
        ioId: idSocket,
        isOnline: false,
      };
      this.server.emit('user-disconnect', true);
      return await this.ioServices.disConnect(infoDisconnect);
    } catch (e) {
      if (e) console.log(e);
    }
  }
  public afterInit(client: any) {}
  @SubscribeMessage('join_room')
  public joinRoom(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const roomName = data.roomId;
    client.join(roomName);
    client.to(roomName).emit('room-created', { room: roomName });
  }

  @SubscribeMessage('chat-group')
  async chatGroup(@MessageBody() data: any, @ConnectedSocket() client: any) {
    const res = await this.roomDataService.insertNewMessage(data);
    if (res.status === true)
      this.server.in(data.idRoom).emit('reveice-group-chat', res);
  }
}
