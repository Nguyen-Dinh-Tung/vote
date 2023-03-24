import { Controller, Get } from "@nestjs/common";
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