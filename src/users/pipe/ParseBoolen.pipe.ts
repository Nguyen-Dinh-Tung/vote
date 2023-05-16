import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';
@Injectable()
export class ParseBoolenPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.isActive) {
      if (value['isActive'] == 1) {
        value['isActive'] = true;
      } else {
        value['isActive'] = false;
      }
      return value;
    }
    return value;
  }
}
