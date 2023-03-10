import { HttpStatus } from '@nestjs/common';
import { Response } from "express";

export interface FindList<T>  {
    data : T [] | undefined ;
    message : string ;
    total : number | undefined ;
    status : HttpStatus ;
    failList : any | undefined;
}