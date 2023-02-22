import { IsNotEmpty } from "class-validator";

export class CreateFeatureDto {
    @IsNotEmpty()
    feature : string ;
    @IsNotEmpty()
    code : string ;
}
