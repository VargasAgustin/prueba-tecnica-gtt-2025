import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({example: 'Agustin'})
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({example: 'user@example.com'})
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({example: '18'})
  @IsInt()
  @Min(18)
  @IsNotEmpty()
  age: number;

  @ApiProperty({example: 'true'})
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({example: '1'})
  @IsNotEmpty()
  @IsString()
  profileId: string;
}
