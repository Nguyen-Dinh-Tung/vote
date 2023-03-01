import { ArgumentMetadata, HttpException, HttpStatus } from '@nestjs/common';
import { PipeTransform } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
const imgType =  ['jpeg', 'jpg', 'png']
@Injectable()
export class ImagePipe implements PipeTransform{
    transform(value? : any , metadata? : ArgumentMetadata){
        let file = value ;
        if(file){
            let mimetype : string = file.mimetype
            if(mimetype){
                let type : string = mimetype.split('/')[1] 
                if(!imgType.includes(type))
                 throw new HttpException( 'Lỗi định dạng ảnh !' ,HttpStatus.NOT_FOUND)
            }

        }
        return file
    }
}