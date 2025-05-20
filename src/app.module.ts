import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profiles/profile.module';

@Module({
  imports: [
    UsersModule,
    ProfileModule, // Replace with your MongoDB connection string
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
