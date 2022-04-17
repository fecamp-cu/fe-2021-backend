import { Controller, HttpStatus, Put, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CheckPolicies, ManagePolicyHandler } from 'src/casl/policyhandler';
import { FileType } from 'src/common/enums/third-party';
import { GoogleCloudStorage } from 'src/third-party/google-cloud/google-storage.service';

@ApiTags('File')
@Controller('file')
export class FileController {
  constructor(private readonly googleStorage: GoogleCloudStorage) {}

  @ApiCreatedResponse({
    description: 'Successfully upload image',
  })
  @Put('image/upload')
  @CheckPolicies(new ManagePolicyHandler())
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile() image: Express.Multer.File,
    @Res() res: Response,
  ): Promise<Response> {
    const { buffer, originalname } = image;

    if (image.size > 20000000) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        reason: 'INVALID_INPUT',
        message: 'Image size is too large',
      });
    }

    if (
      image.mimetype !== 'image/png' &&
      image.mimetype !== 'image/jpeg' &&
      image.mimetype !== 'image/gif'
    ) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        reason: 'INVALID_INPUT',
        message: 'Must be a png or jpeg image',
      });
    }

    const imgName = this.googleStorage.getImageFileName(originalname, FileType.IMAGE);
    const imageURL = await this.googleStorage.uploadImage(imgName, buffer);

    return res.status(HttpStatus.CREATED).json({ message: 'Successfully upload image', imageURL });
  }

  @ApiCreatedResponse({
    description: 'Successfully upload image',
  })
  @Put('upload')
  @CheckPolicies(new ManagePolicyHandler())
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ): Promise<Response> {
    const { buffer, originalname } = file;

    if (file.size > 50000000) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        reason: 'INVALID_INPUT',
        message: 'File size is too large',
      });
    }

    const fileUrl = await this.googleStorage.uploadFile(originalname, buffer);

    return res.status(HttpStatus.CREATED).json({ message: 'Successfully upload file', fileUrl });
  }
}
