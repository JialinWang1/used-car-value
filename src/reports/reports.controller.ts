import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { CreateReportDto } from './dto/create-report.dto'
import { ReportsService } from './reports.service'
import { AuthGuard } from 'src/guards/auth.guard'
import { CurrentUser } from 'src/users/decorators/current-user.decorator'
import { UserEntity } from 'src/users/user.entity'
import { Serialize } from 'src/interceptors/serialize.interceptor'
import { ReportDto } from './dto/report.dto'
import { ApproveReportDto } from './dto/approve-report.dto'
import { AdminGuard } from 'src/guards/admin.guard'
import { GetEstimateDto } from './dto/get-estimate.dto'

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() currentUser: UserEntity) {
    return this.reportsService.create(body, currentUser)
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return this.reportsService.changeApproval(+id, body.approved)
  }

  @Get()
  EstimatePrice(@Query() query: GetEstimateDto) {
    return this.reportsService.createEstimate(query)
  }
}
