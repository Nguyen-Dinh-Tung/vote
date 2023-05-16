import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
@Injectable()
export class ParseQuery implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) return;

    if (value['isActive']) {
      if (value['isActive'] === 'true') value['isActive'] = true;
      else if (value['isActive'] === 'false') value['isActive'] = false;
    }

    return value;
  }
}
