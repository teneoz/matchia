import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'Analyse Ligue 1 2024', minLength: 3, maxLength: 100 })
  @IsString()
  @MinLength(3, { message: 'Le nom doit contenir au moins 3 caractères' })
  @MaxLength(100, { message: 'Le nom ne peut pas dépasser 100 caractères' })
  name: string;

  @ApiPropertyOptional({ example: 'Projet d\'analyse des matchs de la Ligue 1', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'La description ne peut pas dépasser 500 caractères' })
  description?: string;
}
