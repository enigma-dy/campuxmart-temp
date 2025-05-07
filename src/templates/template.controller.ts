import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { TemplateService } from './template.service';

@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post()
  uploadTemplate(@Body() body: { name: string; content: string }) {
    if (!body.name || !body.content) {
      throw new BadRequestException('Template name and content are required');
    }
    return this.templateService.saveTemplate(body.name, body.content);
  }
}
