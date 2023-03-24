import { Controller, Get, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { CreateRoomDto } from "../../rooms/dto/create-room.dto";
import { RoomsDataService } from "../services/rooms-data.service";

@Controller('rooms-data')
export class RoomsDataController {
    constructor(
        private readonly roomsDataService : RoomsDataService
    ){

    }

    @Get()
    getRoomsData(

    ){
        try{


        }catch(e){

            if(e) console.log(e);
            
        }
    }
   
}