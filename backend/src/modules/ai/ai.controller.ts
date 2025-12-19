import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { CreatePredictionDto } from './dto/create-prediction.dto';
import { PredictionResponseDto } from './dto/prediction-response.dto';
import { ChatDto } from './dto/chat.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('ai')
@ApiBearerAuth('JWT-auth')
@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('predictions')
  @ApiOperation({ summary: 'Créer une nouvelle prédiction IA' })
  @ApiResponse({ status: 201, description: 'Prédiction créée', type: PredictionResponseDto })
  async createPrediction(
    @CurrentUser() user: any,
    @Body() createPredictionDto: CreatePredictionDto,
  ): Promise<PredictionResponseDto> {
    return this.aiService.createPrediction(user.id, createPredictionDto);
  }

  @Get('predictions')
  @ApiOperation({ summary: 'Lister mes prédictions' })
  @ApiResponse({ status: 200, description: 'Liste des prédictions', type: [PredictionResponseDto] })
  async findAll(
    @CurrentUser() user: any,
    @Query('projectId') projectId?: string,
  ): Promise<PredictionResponseDto[]> {
    return this.aiService.findAll(user.id, projectId);
  }

  @Get('predictions/:id')
  @ApiOperation({ summary: 'Obtenir une prédiction par ID' })
  @ApiResponse({ status: 200, description: 'Prédiction trouvée', type: PredictionResponseDto })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<PredictionResponseDto> {
    return this.aiService.findOne(id, user.id);
  }

  @Post('chat')
  @ApiOperation({ summary: 'Chatter avec l\'IA' })
  @ApiResponse({ status: 200, description: 'Réponse de l\'IA', schema: { type: 'object', properties: { message: { type: 'string' } } } })
  async chat(@CurrentUser() user: any, @Body() chatDto: ChatDto): Promise<{ message: string }> {
    const response = await this.aiService.chatWithAi(user.id, chatDto.message);
    return { message: response };
  }
}
