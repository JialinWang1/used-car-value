import { Expose, Transform } from 'class-transformer'
import { CreateReportDto } from './create-report.dto'
export class ReportDto {
  @Expose()
  id: number

  @Expose()
  approved: boolean

  @Expose()
  price: number

  @Expose()
  year: number

  @Expose()
  lng: number

  @Expose()
  lat: number

  @Expose()
  make: string

  @Expose()
  model: string

  @Expose()
  mileage: number

  @Expose()
  @Transform(({ obj }) => obj.user.id)
  userId: number
}
