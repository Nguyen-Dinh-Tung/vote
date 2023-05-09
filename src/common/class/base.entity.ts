import { Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  timeAt: Date;
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  timeOut: Date;
  @Column({
    default: true,
  })
  isActive: boolean;
  @Column({
    default: 'default',
  })
  historyCreate: string;

  @Column({
    default: 'done',
  })
  historyChange: string;
}
