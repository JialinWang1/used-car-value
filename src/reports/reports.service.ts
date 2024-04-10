import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateReportDto } from './dto/create-report.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { ReportEntity } from './report.entity'
import { Repository } from 'typeorm'
import { UserEntity } from 'src/users/user.entity'
import { GetEstimateDto } from './dto/get-estimate.dto'

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(ReportEntity) private repo: Repository<ReportEntity>) {}

  createEstimate({ make, model, lat, lng, year, mileage }: GetEstimateDto) {
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make=:make', { make })
      .andWhere('model=:model', { model })
      .andWhere('lng-:lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat-:lat BETWEEN -5 AND 5', { lat })
      .andWhere('year-:year BETWEEN -3 AND 3', { year })
      .orderBy('ABS(mileage-:mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne()
  }

  async changeApproval(id: number, approved: boolean) {
    const report = await this.repo.findOneBy({ id })
    if (!report) {
      throw new NotFoundException('report not found')
    }
    report.approved = approved
    return this.repo.save(report)
  }

  create(createReportDto: CreateReportDto, currentUser: UserEntity) {
    const report = this.repo.create(createReportDto)
    report.user = currentUser
    return this.repo.save(report)
  }
}
