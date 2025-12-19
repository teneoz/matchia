import { ApiProperty } from '@nestjs/swagger';

export class PredictionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ required: false })
  projectId?: string;

  @ApiProperty()
  matchId: number;

  @ApiProperty({ required: false })
  predictedHomeScore?: number;

  @ApiProperty({ required: false })
  predictedAwayScore?: number;

  @ApiProperty({ required: false })
  predictedWinner?: string;

  @ApiProperty({ required: false })
  confidenceScore?: number;

  @ApiProperty({ required: false })
  homeWinProbability?: number;

  @ApiProperty({ required: false })
  drawProbability?: number;

  @ApiProperty({ required: false })
  awayWinProbability?: number;

  @ApiProperty({ required: false })
  analysisText?: string;

  @ApiProperty({ required: false })
  keyFactors?: string[];

  @ApiProperty({ required: false })
  modelVersion?: string;

  @ApiProperty()
  createdAt: Date;
}
