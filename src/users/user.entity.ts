import { Exclude } from 'class-transformer'
import { ReportEntity } from 'src/reports/report.entity'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: true })
  administrator: boolean

  @Column()
  email: string

  @Column()
  password: string

  @OneToMany(() => ReportEntity, (report) => report.user)
  reports: ReportEntity[]
}
