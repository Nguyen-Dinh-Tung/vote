import { CompanyEntity } from 'src/company/entities/company.entity';
import { ROLE_UCP } from './../contants/role.enum';
import { UserEntity } from 'src/users/entities/user.entity';
import { IsNotEmpty, IsOptional } from "class-validator";
import { Roles } from 'src/common/enum/role.enum';

export class InitUcp {
    @IsNotEmpty()
    company : CompanyEntity ;

    @IsNotEmpty()
    user : UserEntity ;
    
    @IsOptional()
    role? : Roles ;
}
