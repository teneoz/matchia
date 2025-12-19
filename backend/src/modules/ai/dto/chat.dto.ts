import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatDto {
  @ApiProperty({ example: 'Qui va gagner entre PSG et OM ?', minLength: 3, maxLength: 1000 })
  @IsString()
  @MinLength(3, { message: 'Le message doit contenir au moins 3 caractères' })
  @MaxLength(1000, { message: 'Le message ne peut pas dépasser 1000 caractères' })
  message: string;
}
