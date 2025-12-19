import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty({ required: false })
  avatarUrl?: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  subscriptionTier: string;

  @ApiProperty()
  creditsRemaining: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
