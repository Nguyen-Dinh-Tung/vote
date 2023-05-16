import { InheriTance } from 'src/common/class/inheritance';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { ContestRecomendEntity } from './ContestRecomend.entity';

@Entity({
  name: 'co',
})
export class ContestEntity extends InheriTance {
  @Column({
    default: 0,
  })
  totalCadidate: number;

  @OneToOne(() => ContestRecomendEntity, (rem) => rem.id)
  @JoinColumn()
  coRem: ContestRecomendEntity;
}
