import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refreshToken: string;

  @ApiProperty({ example: '7d' })
  expiresIn: string;

  @ApiProperty({
    example: {
      id: 'uuid',
      email: 'user@example.com',
      fullName: 'Jean Dupont',
      role: 'user',
    },
  })
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    subscriptionTier: string;
    creditsRemaining: number;
  };
}
