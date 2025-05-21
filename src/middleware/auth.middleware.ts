import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Role } from 'src/profiles/enums/role.enum';


@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor() {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Asignamos un perfil de administrador a todas las solicitudes para simplificar
      // En un entorno real, se validaría el API Key o un JWT token
      const adminProfile = {
        id: 'admin-profile',
        codigo: 'ADMIN',
        nombre: 'Administrador',
        role: Role.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      req['profile'] = adminProfile;
      next();
    } catch (error) {
      next(error);
    }
  }
}