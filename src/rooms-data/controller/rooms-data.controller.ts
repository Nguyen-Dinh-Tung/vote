import { Body, Controller, Get, Post, Res , Param } from "@nestjs/common";
import { Response } from "express";
import { PrivateChatDto } from "src/socket/dto/private-chat.dto";
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

    @Post(':id')
    async creatNewRoomData(
        @Body() data : PrivateChatDto ,
        @Res() res : Response ,
        @Param() param : any 
    ){

        
        try{

            // return await this.roomsDataService.createNewRoomData(data ,res , param.id)


        }catch(e){

            if(e) console.log(e);
            
        }
    }
   
}