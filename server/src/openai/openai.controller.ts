// openai.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { ChatGptDto } from './dto/chat-gpt.dto';

@Controller('chat')
export class OpenAIController {
  constructor(private readonly openAIService: OpenAIService) {}

  @Post()
  async chat(@Body() chatGptDto: ChatGptDto) {
    const response = await this.openAIService.chatWithGPT(chatGptDto.messages);
    return { response };
  }
}
