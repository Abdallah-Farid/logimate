import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { DemandForecastService } from './demand-forecast.service';
import { GenerateForecastDto } from './dto/generate-forecast.dto';

@Controller('demand-forecast')
export class DemandForecastController {
  constructor(private readonly demandForecastService: DemandForecastService) {}

  @Post()
  @UsePipes(new ValidationPipe({ 
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }))
  generateForecast(@Body() generateForecastDto: GenerateForecastDto) {
    const { productId, historicalData } = generateForecastDto;
    return this.demandForecastService.generateMockForecast(productId, historicalData);
  }
}
