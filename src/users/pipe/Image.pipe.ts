import { ArgumentMetadata, HttpException, HttpStatus } from '@nestjs/common';
import { PipeTransform } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
const imgType = ['jpeg', 'jpg', 'png'];
@Injectable()
export class ImagePipe implements PipeTransform {
  transform(value?: any, metadata?: ArgumentMetadata) {
    const file = value;
    if (file) {
      const mimetype: string = file.mimetype;
      if (mimetype) {
        const type: string = mimetype.split('/')[1];
        if (!imgType.includes(type))
          throw new HttpException('Lỗi định dạng ảnh !', HttpStatus.NOT_FOUND);
      }
    }
    return file;
  }
}
