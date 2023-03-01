import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ParseAssm implements PipeTransform{
    transform(value: any, metadata: ArgumentMetadata) {
        if(!value)
        throw new HttpException('Không có dữ liệu' , HttpStatus.NOT_FOUND)

        if(value.isActive !== undefined){
            if(value.isActive  === 'true')
            value.isActive = true
            if(value.isActive  === 'false')
            value.isActive = false
        }
        return value
    }
}