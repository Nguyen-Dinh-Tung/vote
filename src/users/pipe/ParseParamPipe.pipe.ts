import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ParseParamPipe implements PipeTransform{
    transform(value: any, metadata: ArgumentMetadata) {
        let data = {}
        
        if(value){
            if(value.isActive === 'true')
            data['isActive'] = true
            if(value.isActive === 'false')
            data['isActive'] = false
            if(value.isActive === 'ucp')
            data['ucp'] = true

            if(value.search){
                data['search'] = value.search
            }
        }else{
            throw new HttpException('Dữ liệu tìm kiếm không được chuyền lên ' , HttpStatus.BAD_REQUEST)
        }
        return data
    }
}