import { Request } from 'express';
import { mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { join } from 'path';

export class MulterUtils {
  private static destination(folder: string) {
    return (
      req: Request,
      file: Express.Multer.File,
      callback: (error: Error | null, destination: string) => void,
    ) => {
      const path = join('uploads', folder);
      mkdirSync(path, { recursive: true });
      callback(null, path);
    };
  }

  private static genFilename(
    this: void,
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void,
  ): void {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = file.originalname.split('.').pop();
    callback(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
  }

  public static storage(folder: string) {
    return diskStorage({
      destination: this.destination(folder),
      filename: this.genFilename,
    });
  }
}
