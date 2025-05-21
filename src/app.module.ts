import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profiles/profile.module';
import { AuthMiddleware } from './middleware/auth.middleware';

@Module({
  imports: [
    UsersModule,
    ProfileModule, // Replace with your MongoDB connection string
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // Aquí puedes agregar middleware global si es necesario
    consumer.apply(AuthMiddleware).forRoutes('*');
    
  }
}
