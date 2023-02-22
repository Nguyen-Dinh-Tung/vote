import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Validate } from 'src/common/class/validate.entity';
import { Feature } from 'src/common/enum/feature.enum';
import { Repository } from 'typeorm';
import { CreateFeatureDto } from '../dto/create-feature.dto';
import { UpdateFeatureDto } from '../dto/update-feature.dto';
import { FeatureEntity } from '../entities/feature.entity';

@Injectable()
export class FeatureService {
  constructor(@InjectRepository(FeatureEntity) private readonly featureEntity : Repository<FeatureEntity>){

  }
  async create(createFeatureDto: CreateFeatureDto) {
    let checkFeature = await this.validateFeature({code : createFeatureDto.code})
    
    if(!checkFeature){
      let newFeature = await this.featureEntity.save(createFeatureDto) ;
      return newFeature
    }else{
      return {
        message : "Feature existing"
      }
    }
  }

  findAll() {
    return `This action returns all feature`;
  }

  findOne(id: number) {
    return `This action returns a #${id} feature`;
  }

  update(id: number, updateFeatureDto: UpdateFeatureDto) {
    return `This action updates a #${id} feature`;
  }

  remove(id: number) {
    return `This action removes a #${id} feature`;
  }

  async validateFeature (data : Validate): Promise <any>{
    let checkFeature = await this.featureEntity.findOneBy(data)
    return checkFeature
  }
}
