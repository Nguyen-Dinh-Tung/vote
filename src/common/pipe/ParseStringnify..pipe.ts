import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ParseStringnifyPipe implements PipeTransform{
    transform(value: any, metadata: ArgumentMetadata) {
        if(value){
            if(value.listIdCompany){
                value['listIdCompany'] = JSON.parse(value.listIdCompany)
            }
        }
        return value
    }
}