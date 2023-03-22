import { Module } from "@nestjs/common";
import { GateWay } from "./gateway/socket.gateway";


@Module({
    controllers : [] ,
    imports : [] ,
    providers : [GateWay]
})

export class  Socket {


}