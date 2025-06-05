import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { TemplateService } from './template.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

class UploadTemplateDto {
  name: string;
  content: string;
}

@ApiTags('templates')
@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post()
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Upload a new template' })
  @ApiBody({ type: UploadTemplateDto })
  @ApiResponse({ status: 200, description: 'Template uploaded successfully' })
  @ApiResponse({
    status: 400,
    description: 'Template name and content are required',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Failed to save template' })
  uploadTemplate(@Body() body: { name: string; content: string }) {
    if (!body.name || !body.content) {
      throw new BadRequestException('Template name and content are required');
    }
    return this.templateService.saveTemplate(body.name, body.content);
  }
}
