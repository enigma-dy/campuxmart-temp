import { Injectable, BadRequestException } from '@nestjs/common';
import { writeFile, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class TemplateService {
  private templatesPath = join(process.cwd(), 'src', 'templates');

  saveTemplate(name: string, content: string): Promise<{ message: string }> {
    const filePath = join(this.templatesPath, 'data', `${name}.ejs`);

    if (!existsSync(this.templatesPath)) {
      mkdirSync(this.templatesPath, { recursive: true });
    }

    return new Promise((resolve, reject) => {
      writeFile(filePath, content, (err) => {
        if (err)
          return reject(new BadRequestException('Failed to save template'));
        resolve({ message: `${name}.ejs uploaded successfully` });
      });
    });
  }
}
