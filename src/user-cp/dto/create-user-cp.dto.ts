import { UserEntity } from 'src/users/entities/user.entity';
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserCpDto {
    @IsNotEmpty()
    idCompany : string ;

    @IsOptional()
    user : UserEntity ;
}
