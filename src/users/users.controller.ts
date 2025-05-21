import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/profiles/enums/role.enum';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  @ApiOperation({ summary: 'Create a new user' })
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Req() req: Request) {
    // Verificar si el perfil del usuario tiene permisos para crear usuarios
    const userProfile = req['profile'];
    if (userProfile && userProfile.role === Role.ADMIN) {
      return await this.usersService.create(createUserDto);
    } else {
      throw new ForbiddenException('No tienes permisos para crear usuarios');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search users by name or email',
  })
  async findAll(@Req() req: Request) {
    // Verificar si el perfil del usuario tiene permisos para obtener usuarios
    const userProfile = req['profile'];
    if (userProfile) {
      // Cualquier usuario autenticado puede ver los detalles de un usuario
      return await this.usersService.findAll();
    } else {
      throw new ForbiddenException('No tienes permisos para obtener usuarios');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  async findOne(@Param('id') id: string, @Req() req: Request) {
    // Verificar si el perfil del usuario tiene permisos para obtener usuarios
    const userProfile = req['profile'];
    if (userProfile) {
      // Cualquier usuario autenticado puede ver los detalles de un usuario
      return await this.usersService.findOne(id);
    } else {
      throw new ForbiddenException('No tienes permisos para obtener usuarios');
    }
  }


  @ApiOperation({ summary: 'Update a user by ID' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ) {
    // Verificar si el perfil del usuario tiene permisos para actualizar usuarios
    const userProfile = req['profile'];
    if (userProfile && userProfile.role === Role.ADMIN) {
      // Solo los administradores pueden actualizar usuarios
      return await this.usersService.update(id, updateUserDto);
    } else {
      throw new ForbiddenException(
        'No tienes permisos para actualizar usuarios',
      );
    }
  }

  @ApiOperation({ summary: 'Delete a user by ID' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    // Verificar si el perfil del usuario tiene permisos para eliminar usuarios
    const userProfile = req['profile'];
    if (userProfile && userProfile.role === Role.ADMIN) {
      return await this.usersService.remove(id);
    } else {
      throw new ForbiddenException('No tienes permisos para eliminar usuarios');
    }
  }
}
