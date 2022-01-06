import { Bucket, Storage } from '@google-cloud/storage';
import { StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto-js';
import { MetaData } from '../types/google-cloud-storage';

export class GoogleCloudStorage {
  private bucket: Bucket;
  private bucketName: string;
  private storage: Storage;
  constructor(private configService: ConfigService) {
    this.storage = new Storage({
      keyFilename: this.configService.get<string>('gcs.serviceAccountKey'),
    });
    this.bucketName = this.configService.get<string>('gcs.bucketName');
    this.bucket = this.storage.bucket(this.bucketName);
  }

  public async getFileMataData(fileName: string): Promise<MetaData> {
    const [metadata] = await this.storage.bucket(this.bucketName).file(fileName).getMetadata();
    return metadata;
  }

  public getImageURL(imgName: string): string {
    return this.configService.get<string>('gcs.publicURL') + '/' + imgName;
  }

  public async uploadImage(uid: number, img: Buffer): Promise<string> {
    const imgStream = new StreamableFile(img);
    const imgName = this.getImageFileName(uid);
    const file = this.bucket.file(imgName);
    await imgStream.getStream().pipe(file.createWriteStream());
    return await this.getImageURL(imgName);
  }

  private getImageFileName(id: number): string {
    const secret = this.configService.get<string>('gcs.secret');
    return 'profile-' + id + '-' + `${crypto.SHA256(id + secret)}.jpg`;
  }
}
