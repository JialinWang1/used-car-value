import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class ReportEntity {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  email: string
  @Column()
  password: string
}
