<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->


# API de Gestión de Usuarios y Perfiles

API REST desarrollada con NestJS para gestionar usuarios y sus perfiles.

## Características

- Operaciones CRUD completas para usuarios y perfiles
- Validación de datos
- Documentación con Swagger
- Almacenamiento en memoria (con posibilidad de extender a MongoDB)
- Filtrado de usuarios por texto
- Sistema simple de permisos basado en roles (ADMIN y USER)

## Requisitos

- Node.js (v18 o superior)
- npm como gestor de paquetes

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run start:dev

# Compilar para producción
npm run build

# Iniciar en modo producción
npm run start:prod

# La aplicación utiliza almacenamiento en memoria por defecto
```

## Estructura del Proyecto

La estructura del proyecto sigue los principios de arquitectura modular de NestJS, organizando el código en módulos cohesivos y desacoplados. Esta estructura facilita el mantenimiento, la escalabilidad y la comprensión del código, especialmente para desarrolladores junior.

```
src/
├── users/                        # Módulo de usuarios
│   ├── dto/                      # Objetos de transferencia de datos (Data Transfer Objects)
│   ├── entities/                 # Entidades del dominio
│   ├── users.controller.ts       # Controlador REST para usuarios
│   ├── users.controller.spec.ts  # Test unitario del controlador de usuarios
│   ├── users.service.ts          # Lógica de negocio para usuarios
│   ├── users.service.spec.ts     # Test unitario del servicio de usuarios
│   └── users.module.ts           # Definición del módulo de usuarios
├── profiles/                     # Módulo de perfiles
│   ├── dto/                      # Objetos de transferencia de datos
│   ├── entities/                 # Entidades del dominio
│   ├── enums/                    # Enumeraciones (como Role)
│   ├── profile.controller.ts     # Controlador REST para perfiles
│   ├── profile.controller.spec.ts # Test unitario del controlador de perfiles
│   ├── profile.service.ts        # Lógica de negocio para perfiles
│   ├── profile.service.spec.ts   # Test unitario del servicio de perfiles
│   └── profiles.module.ts        # Definición del módulo de perfiles
├── middleware/                   # Middleware de autenticación
│   └── auth.middleware.ts        # Middleware para asignar perfil de usuario
├── main.ts                       # Punto de entrada de la aplicación
test/                             # Pruebas end-to-end (e2e)
│   ├── app.e2e-spec.ts           # Test e2e principal
│   └── jest-e2e.json             # Configuración de Jest para e2e
```

## Endpoints

### Autenticación y Permisos

#### Middleware de Autenticación

La aplicación utiliza un middleware de autenticación simplificado que asigna automáticamente un perfil de administrador a todas las solicitudes para facilitar el desarrollo y las pruebas. Este middleware se encuentra en `src/middleware/auth.middleware.ts`.

```typescript
// Fragmento del middleware de autenticación
async use(req: Request, res: Response, next: NextFunction) {
  try {
    // Asignamos un perfil de administrador a todas las solicitudes para simplificar
    // En un entorno real, se validaría el API Key
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
```

#### Sistema de Permisos

El sistema de permisos es muy simple y está basado en roles. Cada perfil tiene un rol asignado que puede ser:

- **ADMIN**: Acceso completo a todas las funcionalidades (GET, POST, PUT, DELETE)
- **USER**: Acceso de solo lectura (solo métodos GET)

Los permisos se verifican directamente en los controladores mediante comprobaciones del rol del usuario.

#### Prueba de Diferentes Roles

Para probar el comportamiento con diferentes roles, puedes modificar el middleware de autenticación (`src/middleware/auth.middleware.ts`) cambiando el rol asignado de `Role.ADMIN` a `Role.USER`:

```typescript
const userProfile = {
  id: 'user-profile',
  codigo: 'USER',
  nombre: 'Usuario',
  role: Role.USER,  // Cambiar a Role.USER para probar permisos limitados
  createdAt: new Date(),
  updatedAt: new Date(),
};

req['profile'] = userProfile;
```

### Usuarios

- `GET /users` - Obtener todos los usuarios
- `GET /users?search=texto` - Buscar usuarios por texto
- `GET /users/:id` - Obtener un usuario por ID
- `POST /users` - Crear un nuevo usuario
- `PATCH /users/:id` - Actualizar un usuario
- `DELETE /users/:id` - Eliminar un usuario

### Perfiles

- `GET /profiles` - Obtener todos los perfiles
- `GET /profiles/:id` - Obtener un perfil por ID
- `POST /profiles` - Crear un nuevo perfil
- `PATCH /profiles/:id` - Actualizar un perfil
- `PATCH /profiles/:id/role` - Actualizar el rol de un perfil
- `DELETE /profiles/:id` - Eliminar un perfil

## Documentación

La documentación de la API está disponible en la ruta `/api` una vez que la aplicación esté en ejecución.

## Docker

Se agrego el archivo .dockerignore correspondiente para hacer mas liviana la imagen.

Para ejecutar la aplicación con Docker:

```bash
# Construir la imagen
docker build -t prueba-tecnica-gtt .

# Ejecutar el contenedor
docker run -p 3000:3000 prueba-tecnica-gtt
```


## Observaciones

- La aplicación está diseñada para utilizar almacenamiento en memoria, lo que facilita las pruebas y el desarrollo.
- Se ha implementado la estructura necesaria para soportar MongoDB como almacenamiento alternativo, aunque no es necesario para el funcionamiento actual.
- El sistema de permisos se ha simplificado al máximo para facilitar su comprensión, utilizando solo dos roles: ADMIN y USER.

## Pruebas

```bash
# Ejecutar pruebas unitarias
npm run test

# Ejecutar pruebas e2e
npm run test:e2e

# Ejecutar pruebas con cobertura
npm run test:cov
```

## Colección de Postman

El proyecto incluye una colección de Postman para facilitar las pruebas de los endpoints. Puedes encontrarla en la carpeta `postman` del proyecto. Para usarla:

1. Importa la colección en Postman
2. Configura la variable de entorno `baseUrl` con la URL de tu API (por defecto: `http://localhost:3000`)
3. Ejecuta las solicitudes para probar los diferentes endpoints

## Licencia
Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).