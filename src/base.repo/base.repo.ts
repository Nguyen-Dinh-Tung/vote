import { Repository } from 'typeorm';
export class BaseRepo<T> {
    constructor(private readonly  repo: Repository<T>){

    }

}