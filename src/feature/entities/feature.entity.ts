import { PrimaryGeneratedColumn  , Entity} from 'typeorm';
import { Column } from 'typeorm';
@Entity({
    name : 'feature',
})
export class FeatureEntity {
    @PrimaryGeneratedColumn('uuid')
    id : string ;
    @Column()
    feature : string ;
    @Column()
    code : string ;
    
}
