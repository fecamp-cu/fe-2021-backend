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
      keyFilename: this.configService.get<string>('google.gcs.serviceAccountKey'),
    });
    this.bucketName = this.configService.get<string>('google.gcs.bucketName');
    this.bucket = this.storage.bucket(this.bucketName);
  }

  public async getFileMataData(fileName: string): Promise<MetaData> {
    const [metadata] = await this.storage.bucket(this.bucketName).file(fileName).getMetadata();
    return metadata;
  }

  public async uploadImage(firstName: string, lastName: string, img: Buffer): Promise<string> {
    const imgStream = new StreamableFile(img);
    const imgName = this.getImageFileName(firstName + '-' + lastName);
    const file = this.bucket.file(imgName);
    await imgStream.getStream().pipe(file.createWriteStream());
    return await this.getImageURL(imgName);
  }

  public async uploadFile(filename: string, sourceFile: Buffer): Promise<string> {
    const fileStream = new StreamableFile(sourceFile);
    const fileNameHashed = this.getFileName(filename);
    const file = this.bucket.file(fileNameHashed);
    await fileStream.getStream().pipe(file.createWriteStream());
    return this.getFileURL(fileNameHashed);
  }

  private getImageURL(imgName: string): string {
    return this.configService.get<string>('google.gcs.publicURL') + '/' + imgName;
  }

  private getImageFileName(ownerName: string): string {
    const secret = this.configService.get<string>('google.gcs.secret');
    return 'profile-' + ownerName + '-' + `${crypto.SHA256(ownerName + secret)}.jpg`;
  }

  private getFileURL(fileName: string): string {
    return encodeURI(this.configService.get<string>('google.gcs.publicURL') + '/' + fileName);
  }

  private getFileName(fileName: string): string {
    const secret = this.configService.get<string>('google.gcs.secret');
    return 'file-' + `${crypto.SHA256(fileName + secret)}` + '-' + fileName;
  }
}
