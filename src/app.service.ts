import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatusService(){
  return {
    status: HttpStatus.OK,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };
}
}
