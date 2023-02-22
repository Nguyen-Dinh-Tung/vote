import { PipeTransform, ArgumentMetadata , } from '@nestjs/common';
import { Injectable } from "@nestjs/common/decorators";

@Injectable()
export class ParserDataPipe implements PipeTransform{
    transform( value : any  , metadata : ArgumentMetadata){
        console.log(value , ';value');
        return value
    }
}