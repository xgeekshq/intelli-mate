import { existsSync, mkdirSync } from 'fs';
import { Injectable, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Injectable()
export class DocumentsInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  intercept() {
    const documentsFolder = this.configService.get('CHAT_DOCUMENTS_FOLDER');

    return FilesInterceptor('files', 2, {
      storage: diskStorage({
        destination: (req, _, cb) => {
          const uploadPath = `${documentsFolder}/${req.params.roomId}`;
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (_, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }) as any;
  }
}
