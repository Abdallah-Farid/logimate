import { IsArray, IsNotEmpty, IsString, ArrayMinSize, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class GenerateForecastDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1, { message: 'Historical data must contain at least one value' })
  @IsNumber({}, { each: true, message: 'Each historical data point must be a number' })
  @Type(() => Number)
  historicalData: number[];
}
