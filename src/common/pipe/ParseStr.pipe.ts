import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ParseStrPipe implements PipeTransform{
    transform(value: any, metadata: ArgumentMetadata) {
        if(value)
        if(value.share)
        value['share'] = JSON.parse(value.share)
        return value
    }
}