import { Headers } from "@nestjs/common/decorators";
import { WebSocketGateway ,WebSocketServer , SubscribeMessage, MessageBody } from "@nestjs/websockets";
import { ConnectedSocket } from "@nestjs/websockets/decorators";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WsResponse } from "@nestjs/websockets/interfaces";
import { Socket } from "dgram";
import {Server} from 'socket.io'
@WebSocketGateway({name : 'chats' , cors : true})

export class GateWay implements OnGatewayConnection , OnGatewayDisconnect , OnGatewayInit{

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

    public handleConnection(client: any , ...args: any[]) {
        
    }
    public handleDisconnect(client: any) {
        
    }

    public afterInit(client :any){
        
        
    }
    public joinRoom(){

    }
}