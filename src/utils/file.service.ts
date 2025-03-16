import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class FileService {
  constructor(private configService: ConfigService) {}

  getFilePath(fileName: string, fileType: string): string {
    const uploadPath =
      this.configService.get<string>('UPLOAD_PATH') || 'uploads';
    return path.join(__dirname, '..', '..', uploadPath, fileType, fileName);
  }

  fileExists(fileName: string, fileType: string): boolean {
    const filePath = this.getFilePath(fileName, fileType);
    return fs.existsSync(filePath);
  }

  deleteFile(fileName: string, fileType: string): boolean {
    const filePath = this.getFilePath(fileName, fileType);
    if (this.fileExists(fileName, fileType)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  }
}
