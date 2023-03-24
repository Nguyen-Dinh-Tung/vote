import { UioServices } from './../../uio/services/uio.services';
import { IoEntity } from '../../uio/entities/io.entity';
import { WebSocketGateway ,WebSocketServer , SubscribeMessage, MessageBody } from "@nestjs/websockets";
import { ConnectedSocket } from "@nestjs/websockets/decorators";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit} from "@nestjs/websockets/interfaces";
import {Server} from 'socket.io'
import jwtDecode from "jwt-decode";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
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
         @ConnectedSocket() client : any
         ){
            
    }

    @SubscribeMessage('chat')
    async privateChat(
        @MessageBody() data : any,
        @ConnectedSocket() client : any
        ) {
        
        let ioIdReceive = await this.ioServices.privateChat(data.idUser)
        
        client.to(ioIdReceive.ioId).emit('chat' , data.message)
    }
    @SubscribeMessage('chat-room')
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