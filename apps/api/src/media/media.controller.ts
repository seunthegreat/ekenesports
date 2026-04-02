import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: string
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    
    const result = await this.mediaService.uploadImage(file, folder);
    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
    };
  }
}
