import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Prediction } from '../../entities/prediction.entity';
import { CreditTransaction, TransactionType } from '../../entities/credit-transaction.entity';
import { UsersService } from '../users/users.service';
import { CreatePredictionDto } from './dto/create-prediction.dto';
import { RedisService } from '../redis/redis.service';
import Anthropic from '@anthropic-ai/sdk';

@Injectable()
export class AiService {
  private anthropic: Anthropic;

  constructor(
    @InjectRepository(Prediction)
    private predictionsRepository: Repository<Prediction>,
    @InjectRepository(CreditTransaction)
    private transactionsRepository: Repository<CreditTransaction>,
    private usersService: UsersService,
    private redisService: RedisService,
    private configService: ConfigService,
  ) {
    const apiKey = process.env.ANTHROPIC_API_KEY || this.configService.get<string>('ANTHROPIC_API_KEY');
    if (apiKey) {
      this.anthropic = new Anthropic({ apiKey });
    }
  }

  async createPrediction(
    userId: string,
    createPredictionDto: CreatePredictionDto,
  ): Promise<Prediction> {
    // Check user credits
    const user = await this.usersService.findOne(userId);
    if (user.creditsRemaining <= 0) {
      throw new ForbiddenException('Crédits insuffisants pour créer une prédiction');
    }

    // Check cache first
    const cacheKey = `prediction:match:${createPredictionDto.matchId}`;
    const cached = await this.redisService.get<Prediction>(cacheKey);
    if (cached) {
      // Create a copy for the user
      const prediction = this.predictionsRepository.create({
        ...cached,
        id: undefined,
        userId,
        projectId: createPredictionDto.projectId,
        createdAt: undefined,
      });
      const saved = await this.predictionsRepository.save(prediction);

      // Deduct credit
      await this.deductCredit(userId, saved.id);

      return saved;
    }

    // Generate prediction with AI (simplified for now)
    const predictionData = await this.generatePrediction(createPredictionDto.matchId);

    // Create prediction
    const prediction = this.predictionsRepository.create({
      ...predictionData,
      ...createPredictionDto,
      userId,
    });

    const saved = await this.predictionsRepository.save(prediction);

    // Cache the prediction
    await this.redisService.set(cacheKey, predictionData, 3600); // 1 hour

    // Deduct credit
    await this.deductCredit(userId, saved.id);

    return saved;
  }

  async findAll(userId: string, projectId?: string): Promise<Prediction[]> {
    const where: any = { userId };
    if (projectId) {
      where.projectId = projectId;
    }

    return this.predictionsRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Prediction> {
    const prediction = await this.predictionsRepository.findOne({
      where: { id },
    });

    if (!prediction) {
      throw new BadRequestException(`Prédiction avec l'ID ${id} non trouvée`);
    }

    if (prediction.userId !== userId) {
      throw new ForbiddenException('Vous n\'avez pas accès à cette prédiction');
    }

    return prediction;
  }

  private async generatePrediction(matchId: number): Promise<Partial<Prediction>> {
    // This is a simplified version - in production, you would call the actual AI service
    // and process match data from the football API
    
    if (!this.anthropic) {
      // Fallback if Anthropic is not configured
      return {
        confidenceScore: 75,
        homeWinProbability: 40,
        drawProbability: 30,
        awayWinProbability: 30,
        predictedWinner: 'home',
        analysisText: 'Analyse générée',
        keyFactors: ['Forme récente', 'Confrontations directes'],
        modelVersion: '1.0',
      };
    }

    // TODO: Implement actual AI prediction generation
    // This would involve:
    // 1. Fetching match data from football API
    // 2. Building a prompt with match statistics
    // 3. Calling Anthropic API
    // 4. Parsing the response

    return {
      confidenceScore: 75,
      homeWinProbability: 40,
      drawProbability: 30,
      awayWinProbability: 30,
      predictedWinner: 'home',
      analysisText: 'Analyse générée par IA',
      keyFactors: ['Forme récente', 'Confrontations directes'],
      modelVersion: '1.0',
    };
  }

  private async deductCredit(userId: string, predictionId: string | null): Promise<void> {
    // Update user credits
    await this.usersService.updateCredits(userId, -1);

    // Log transaction
    const transaction = this.transactionsRepository.create({
      userId,
      amount: -1,
      transactionType: TransactionType.USAGE,
      description: 'Prédiction générée',
      predictionId: predictionId || undefined,
    });

    await this.transactionsRepository.save(transaction);
  }

  async chatWithAi(userId: string, message: string): Promise<string> {
    // Check user credits
    const user = await this.usersService.findOne(userId);
    if (user.creditsRemaining <= 0) {
      throw new ForbiddenException('Crédits insuffisants pour utiliser le chat IA');
    }

    if (!this.anthropic) {
      throw new BadRequestException('Service IA non configuré');
    }

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
      });

      const content = response.content[0];
      if (content.type === 'text') {
        // Deduct credit for AI usage
        await this.deductCredit(userId, null);

        return content.text;
      }

      throw new BadRequestException('Réponse invalide de l\'IA');
    } catch (error) {
      throw new BadRequestException(`Erreur lors de la génération de la réponse: ${error.message}`);
    }
  }
}
