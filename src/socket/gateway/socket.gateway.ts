import { UioServices } from './../../uio/services/uio.services';
import { IoEntity } from './../../uio/entity/io.entity';
import { Res } from "@nestjs/common/decorators";
import { WebSocketGateway ,WebSocketServer , SubscribeMessage, MessageBody } from "@nestjs/websockets";
import { ConnectedSocket } from "@nestjs/websockets/decorators";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WsResponse } from "@nestjs/websockets/interfaces";
import { Socket } from "dgram";
import {Server} from 'socket.io'
import jwtDecode from "jwt-decode";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common/enums';
@WebSocketGateway({name : 'chats' , cors : true})

export class GateWay implements OnGatewayConnection , OnGatewayDisconnect , OnGatewayInit{

    constructor(
        @InjectRepository(IoEntity) private readonly ioEntity : Repository<IoEntity> ,
        private readonly  ioServices : UioServices
    ){

    }
    @WebSocketServer()
    private readonly server: Server;

    @SubscribeMessage('events')
    onEvents(
        @MessageBody() data : string ,
         @ConnectedSocket() client : Socket
         ){
            
    }

    @SubscribeMessage('chat')
    privateChat(@MessageBody() data : string) {
        
    }
    @SubscribeMessage('chat-room')
    privateRoom(@MessageBody() data : string) {
        
    }

    public async handleConnection(
        client: any ,
         ...args: any[] 
        ) {
        let token  : any ;
        if(client.handshake.auth.token)
        token = jwtDecode(client.handshake.auth.token) ;
        let idUser : string ;
        if(token)
        idUser = client.id   
        let idSocket : string = client.id ;
        let infoConnect  = {
            idUser :idUser , 
            ioId : idSocket , 
            isOnline : true
        }
        let connect =  await this.ioServices.connect(infoConnect)
        if(connect)
        this.server.to(client.id).emit('connected' , true)
        if(!connect)
        this.server.to(client.id).emit('connected' , false)
    }
    public handleDisconnect(client: any) {
        console.log('disconnect');
        
    }

    public afterInit(client :any){
        
        
    }
    public joinRoom(){

    }
}