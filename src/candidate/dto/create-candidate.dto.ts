import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ERROR_FOMAT_MEASURE } from '../contants/message';
@ValidatorConstraint({ name: 'measure', async: false })
export class CustomMeasure implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    console.log(validationArguments);

    const measure = value.split('-');
    let flag = true;
    if (measure.length !== 3) return false;

    for (const e of measure) {
      if (typeof Number(e) !== 'number') flag = false;
    }
    if (!flag) return false;
    return true;
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return ERROR_FOMAT_MEASURE;
  }
}

export class CreateCandidateDto {
  @ApiProperty({ example: 'name' })
  @IsNotEmpty()
  name: string;
  @ApiProperty({ example: 'address' })
  @IsNotEmpty()
  address: string;
  @ApiProperty({ example: 'email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty({ type: 'string', format: 'binary' })
  background: Express.Multer.File;
  @ApiProperty({ example: '50' })
  @IsNotEmpty()
  weight: string;
  @ApiProperty({ example: '170' })
  @IsNotEmpty()
  height: string;
  @Validate(CustomMeasure)
  @ApiProperty({ example: '90-60-90' })
  @IsNotEmpty()
  measure: string;
  @ApiProperty({ example: 'Hi my name is Tung phich' })
  @IsNotEmpty()
  @IsOptional()
  slogan: string;
  @ApiProperty({ example: '123' })
  @IsNotEmpty()
  idno: string;
  @ApiProperty({ example: 'Helloword' })
  @IsNotEmpty()
  descs: string;
}
