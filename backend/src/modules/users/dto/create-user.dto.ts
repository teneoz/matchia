import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Jean Dupont' })
  @IsString()
  @MinLength(2)
  fullName: string;

  @ApiProperty({ example: 'hashed-password' })
  @IsString()
  password: string;

  @ApiPropertyOptional({ example: 'http://example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
