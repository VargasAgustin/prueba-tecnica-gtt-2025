import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  
  @ApiOperation({summary: 'Get API health status'})
  @Get()
  getStatusService() {
    return this.appService.getStatusService();
  }
}
