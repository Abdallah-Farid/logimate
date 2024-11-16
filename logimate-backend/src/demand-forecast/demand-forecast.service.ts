import { Injectable } from '@nestjs/common';

@Injectable()
export class DemandForecastService {
  generateMockForecast(productId: string, historicalData: number[]): any {
    // Generate mock forecast by adding random fluctuations to historical averages
    const average = historicalData.reduce((a, b) => a + b, 0) / historicalData.length;
    const forecast = Array(7).fill(0).map(() =>
      Math.round(average + (Math.random() * 0.2 - 0.1) * average)
    );

    return {
      productId,
      forecast,
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    };
  }
}
