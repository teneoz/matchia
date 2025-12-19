import { IsInt, IsOptional, IsUUID, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePredictionDto {
  @ApiProperty({ example: 123 })
  @IsInt()
  matchId: number;

  @ApiPropertyOptional({ example: 'uuid' })
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @ApiPropertyOptional({ example: 2, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  predictedHomeScore?: number;

  @ApiPropertyOptional({ example: 1, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  predictedAwayScore?: number;

  @ApiPropertyOptional({ enum: ['home', 'away', 'draw'] })
  @IsOptional()
  predictedWinner?: 'home' | 'away' | 'draw';

  @ApiPropertyOptional({ example: 85.5, minimum: 0, maximum: 100 })
  @IsOptional()
  @Min(0)
  @Max(100)
  confidenceScore?: number;
}
