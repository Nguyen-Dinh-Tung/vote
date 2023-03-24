import { Controller, Get, Post, Res } from "@nestjs/common";
import { Body } from "@nestjs/common/decorators/http/route-params.decorator";
import { Response } from "express";
import { CreateRoomDto } from "../dto/create-room.dto";
import { RoomsService } from "../services/rooms.service";

@Controller('rooms')
export class RoomsController{
    constructor(
        private readonly roomsService : RoomsService
    ){

    }

    @Post()
    async createRoom(
        @Res() res : Response , 

        @Body() data : CreateRoomDto
        ){
        try{
            return await this.roomsService.createRoom(res , data)
        }catch(e) {

            if(e) console.log(e);
            
        }
    }
}