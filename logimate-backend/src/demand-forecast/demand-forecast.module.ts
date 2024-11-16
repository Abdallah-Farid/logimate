import { Module } from '@nestjs/common';
import { DemandForecastController } from './demand-forecast.controller';
import { DemandForecastService } from './demand-forecast.service';

@Module({
  controllers: [DemandForecastController],
  providers: [DemandForecastService],
  exports: [DemandForecastService],
})
export class DemandForecastModule {}
