import { RoomsDataEntity } from './../../rooms-data/entities/rooms-data.entity';
import { WebSocketGateway ,WebSocketServer , SubscribeMessage, MessageBody } from "@nestjs/websockets";
import { ConnectedSocket } from "@nestjs/websockets/decorators";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit} from "@nestjs/websockets/interfaces";
import {Server} from 'socket.io'
import jwtDecode from "jwt-decode";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { IoServices } from "src/io/services/io.service";
import { IoEntity } from "src/io/entities/io.entity";
import { PrivateChatDto } from "../dto/private-chat.dto";
import { RoomEntity } from 'src/rooms/entities/rooms.entity';
import { ConnectIoEntity } from 'src/io/entities/connect-io.entity';
@WebSocketGateway({name : 'chats' , cors : true})

export class GateWay implements OnGatewayConnection , OnGatewayDisconnect , OnGatewayInit{

    constructor(
        @InjectRepository(IoEntity) private readonly ioEntity : Repository<IoEntity> ,
        private readonly  ioServices : IoServices ,
        @InjectRepository(RoomEntity) private readonly roomEntity : Repository<RoomEntity> ,
        @InjectRepository(ConnectIoEntity) private readonly cnsEntity : Repository<ConnectIoEntity> ,
    ){

    }
    @WebSocketServer()
    private readonly server: Server;

    @SubscribeMessage('events')
    onEvents(
        @MessageBody() data : string ,
        @ConnectedSocket() client : any
    ){
            
    }

    @SubscribeMessage('chat')
    async privateChat(
        @MessageBody() data : any,
        @ConnectedSocket() client : any
    ) {
        
        let ioIdReceive = await this.ioServices.privateChat(data.idUser)
        
        client.to(ioIdReceive.socketId).emit('chat' , data.message)
    }
    @SubscribeMessage('private-chat')
    async privateChatHandle(
    @MessageBody() data : any ,
    @ConnectedSocket()client : any 
    ){
        let checkRoom = await this.roomEntity.findOne({
            where : {
                id : data.idRoom
            }
        })
        let ccnnects = await this.cnsEntity.find({
            where : {
                room : checkRoom
            } ,
            relations : {
                io : true
            }
        })
        console.log(client.id  , 'client.id ');
        
        for(let e of ccnnects){
            if(
                e.io.isOnline &&
                e.io.socketId !== client.id 
                ){
                    console.log('<<<<<<<<<<<<<< neeeeeeeeee >>>>>>>>>>>>');
                    
                    this.server.to(e.io.socketId).emit('private-chat' , {
                        status : true , 
                        roomId : checkRoom.id
                    })
                }
            
        }        
    }
    @SubscribeMessage('join-room')
    privateRoom(
        @MessageBody() data : string ,
        @ConnectedSocket() client : any
    ) {
        
    }

    public async handleConnection(
        client: any ,
         ...args: any[] 
    ) {
       try{

        let token  : any ;
        if(client.handshake.auth.token)
        token = jwtDecode(client.handshake.auth.token) ;
        
        let idUser : string ;
        if(token)
        idUser = token.idUser   
        
        let idSocket : string = client.id ;

        let infoConnect  = {
            idUser :idUser , 
            ioId : idSocket , 
            isOnline : true
        }

        let connect = await this.ioServices.connect(infoConnect)

        return this.server.to(client.id).emit('online', {connect : connect})

    }catch(e){

        if(e) console.log(e);
        
       }

    }
    public async handleDisconnect(client: any) {
        try{

            let token  : any ;
            if(client.handshake.auth.token)
            token = jwtDecode(client.handshake.auth.token) ;
            
            let idUser : string ;
            if(token)
            idUser = token.idUser   
            
            let idSocket : string = client.id ;
    
            let infoDisconnect  = {
                idUser :idUser , 
                ioId : idSocket , 
                isOnline : false
            }

            return await this.ioServices.disConnect(infoDisconnect)
            
    
        }catch(e){
    
            if(e) console.log(e);
            
        }    
    }

    public afterInit(client :any){
        
        
    }
    public joinRoom(){

    }
}