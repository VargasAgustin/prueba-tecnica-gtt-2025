import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '../enums/role.enum';

export class CreateProfileDto {
  @ApiProperty({example: 'User Profile'})
  @IsString()
  @IsNotEmpty()
  profileName: string;

  @ApiProperty({example: 'user_profile'})
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({example: true})
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({example: Role.USER , enum: Role, description: 'Role of the user', default: Role.USER})
  @IsEnum(Role)
  role: Role;
}
