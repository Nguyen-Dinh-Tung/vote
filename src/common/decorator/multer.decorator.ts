import { applyDecorators } from '@nestjs/common/decorators/core/apply-decorators';
import { ApiConsumes } from '@nestjs/swagger';
export const apiDecorator = () => {
  return applyDecorators(ApiConsumes('multipart/form-data'));
};
