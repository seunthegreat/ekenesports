import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class MediaService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'ekene-sports/products'
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
        },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) return reject(new InternalServerErrorException(error.message));
          resolve(result);
        }
      );

      const stream = new Readable();
      stream.push(file.buffer);
      stream.push(null);
      stream.pipe(uploadStream);
    });
  }

  async deleteImage(publicId: string): Promise<any> {
    try {
      return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete image from Cloudinary');
    }
  }
}
