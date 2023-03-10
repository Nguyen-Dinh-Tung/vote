
export enum NextCheckShare {
    NOT = 0 ,
    CAN = 1
}


export interface CheckShareInterface {
    next : NextCheckShare ;
    message : string | undefined ;
}