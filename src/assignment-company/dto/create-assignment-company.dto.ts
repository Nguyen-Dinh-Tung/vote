import { IsNotEmpty } from "class-validator";

export class CreateAssignmentCompanyDto {
    @IsNotEmpty()
    idCompany : string ;
    @IsNotEmpty()
    idContest : string ;
}
