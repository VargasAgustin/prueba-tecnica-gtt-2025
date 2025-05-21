import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from './enums/role.enum';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @ApiOperation({ summary: 'Create a new profile' })
  @Post()
  async create(
    @Body() createProfileDto: CreateProfileDto,
    @Req() req: Request,
  ) {
    // Verificar si el perfil del usuario tiene permisos para crear perfiles
    const userProfile = req['profile'];
    if (userProfile && userProfile.role === Role.ADMIN) {
      return await this.profileService.create(createProfileDto);
    } else {
      throw new ForbiddenException('No tienes permisos para crear perfiles');
    }
  }

  @ApiOperation({ summary: 'Get all profiles' })
  @Get()
  async findAll(@Req() req: Request) {
    // Verificar si el perfil del usuario tiene permisos para obtener perfiles
    const userProfile = req['profile'];
    if (userProfile) {
      // Cualquier usuario autenticado puede ver la lista de perfiles
      return await this.profileService.findAll();
    } else {
      throw new ForbiddenException('No tienes permisos para obtener perfiles');
    }
  }


  @ApiOperation({ summary: 'Get a profile by ID' })
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    // Verificar si el perfil del usuario tiene permisos para obtener perfiles
    const userProfile = req['profile'];
    if (userProfile) {
      // Cualquier usuario autenticado puede ver la lista de perfiles
      return await this.profileService.findOne(id);
    } else {
      throw new ForbiddenException('No tienes permisos para obtener perfiles');
    }
  }

  @ApiOperation({ summary: 'Update a profile by ID' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @Req() req: Request,
  ) {
    // Verificar si el perfil del usuario tiene permisos para actualizar perfiles
    const userProfile = req['profile'];
    if (userProfile && userProfile.role === Role.ADMIN) {
      // Solo los administradores pueden actualizar perfiles
      return await this.profileService.update(id, updateProfileDto);
    } else {
      throw new ForbiddenException(
        'No tienes permisos para actualizar perfiles',
      );
    }
  }

  @ApiOperation({ summary: 'Delete a profile by ID' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    // Verificar si el perfil del usuario tiene permisos para eliminar perfiles
    const userProfile = req['profile'];
    if (userProfile && userProfile.role === Role.ADMIN) {
      return await this.profileService.remove(id);
    } else {
      throw new ForbiddenException('No tienes permisos para eliminar perfiles');
    }
  }
}
