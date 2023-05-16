import { InheriTance } from 'src/common/class/inheritance';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { CandidateRecomendEntity } from './candidate-recomend.entity';
@Entity({
  name: 'ca',
})
export class CandidateEntity extends InheriTance {
  @Column({
    default: 'Default',
  })
  idno: string;

  @Column({
    default: 'default',
  })
  height: string;
  @Column({
    default: 'default',
  })
  weight: string;

  @Column({
    default: 'default',
  })
  measure: string;

  @OneToOne(() => CandidateRecomendEntity, (rem) => rem.id)
  @JoinColumn()
  carem: CandidateRecomendEntity;
}
