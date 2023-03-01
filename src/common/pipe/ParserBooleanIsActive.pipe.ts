import { NOT_DATA } from './../../contest/contants/contants';
import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()

export class ParserBooleanIsActive implements PipeTransform{
    transform(value: any, metadata: ArgumentMetadata) {
        if(value){

            if(value['isActive'] !== undefined){
                if(value['isActive'] === 'true'){
                    value['isActive'] = true
                }
                if(value['isActive'] === 'false')
                value['isActive'] = false
            }


        }else{
            throw new HttpException(NOT_DATA, HttpStatus.NOT_FOUND)
        }

        return value
    }
}