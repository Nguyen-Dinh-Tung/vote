import { CompanyEntity } from 'src/company/entities/company.entity';
import { ROLE_UCP } from './../contants/role.enum';
import { UserEntity } from 'src/users/entities/user.entity';
import { IsNotEmpty, IsOptional } from "class-validator";

export class InitUcp {
    @IsNotEmpty()
    company : CompanyEntity ;

    @IsNotEmpty()
    user : UserEntity ;
    
    @IsOptional()
    role? : ROLE_UCP ;
}
