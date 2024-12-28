import { GetMediaUrlRes } from '@/dto/media/get-image-url.res';
import { GetMediaDto } from '@/dto/media/get-media.dto';
import { MediaUploadRes } from '@/dto/media/media-upload.res';
import { Readable } from 'stream';

export interface IMediaService {
  get(fileName: string, mediaCategory?: string): Promise<GetMediaDto>;
  getVideoUrl(mediaCategory: string): Promise<GetMediaUrlRes>;
  uploadVideo(fileName: string, tempFilePath: string, mediaCategory: string): Promise<MediaUploadRes>;
  uploadImage(fileName: string, tempFilePath: string, mediaCategory: string): Promise<MediaUploadRes>;
  getImageUrl(mediaCategory: string): Promise<GetMediaUrlRes>;
}
