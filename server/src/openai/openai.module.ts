import { Module } from '@nestjs/common';

import { OpenAIController } from './openai.controller';
import { OpenAIService } from './openai.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [OpenAIService],
  controllers: [OpenAIController],
})
export class OpenaiModule {}
