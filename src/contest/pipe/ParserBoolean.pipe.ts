import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ParserBoolean implements PipeTransform{
    transform(value : any , metadata : ArgumentMetadata){
        if(value){
            if(value.isActive ==='true' || value.isActive ==='1'){
                value.isActive = true
            }else if(value.isActive === 'false'){
                value.isActive = false
            }
        }
        return value
    }
}