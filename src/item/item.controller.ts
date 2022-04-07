import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiCreatedResponse, ApiHeaders, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Public } from 'src/auth/auth.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies, ManagePolicyHandler } from 'src/casl/policyhandler';
import { ItemIndexDto } from './dto/item-index.dto';
import { ItemDto } from './dto/item.dto';
import { ItemIndexService } from './item-index.service';
import { ItemService } from './item.service';

@ApiTags('Item')
@ApiHeaders([{ name: 'XSRF-TOKEN', description: 'CSRF Token' }])
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('item')
export class ItemController {
  constructor(
    private readonly itemService: ItemService,
    private readonly itemIndexService: ItemIndexService,
  ) {}

  @CheckPolicies(new ManagePolicyHandler())
  @Post()
  create(@Body() itemDto: ItemDto) {
    return this.itemService.create(itemDto);
  }

  @Get()
  @Public()
  findAll(@Query('index') withIndex: boolean = false) {
    let relations: string[] = [];
    if (withIndex) {
      relations = ['indexes'];
    }
    return this.itemService.findAll(relations);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.itemService.findOne(id);
  }

  @CheckPolicies(new ManagePolicyHandler())
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() itemDto: ItemDto) {
    return this.itemService.update(id, itemDto);
  }

  @CheckPolicies(new ManagePolicyHandler())
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.itemService.remove(id);
  }

  @CheckPolicies(new ManagePolicyHandler())
  @Post(':id/index')
  createindex(@Param('id', ParseIntPipe) id: number, @Body() itemIndexDto: ItemIndexDto) {
    itemIndexDto.item = new ItemDto({ id });
    return this.itemIndexService.create(itemIndexDto);
  }

  @Get('index')
  findAllIndex() {
    return this.itemIndexService.findAll();
  }

  @Get('index/:id')
  findOneIndex(@Param('id', ParseIntPipe) id: number) {
    return this.itemIndexService.findOne(id);
  }

  @CheckPolicies(new ManagePolicyHandler())
  @Patch('index/:id')
  updateIndex(@Param('id', ParseIntPipe) id: number, @Body() itemIndexDto: ItemIndexDto) {
    return this.itemIndexService.update(id, itemIndexDto);
  }

  @CheckPolicies(new ManagePolicyHandler())
  @Delete('index/:id')
  removeIndex(@Param('id', ParseIntPipe) id: number) {
    return this.itemIndexService.remove(id);
  }

  @ApiCreatedResponse({
    description: 'Successfully upload item thumbnail',
  })
  @Put(':id/thumbnail/upload')
  @CheckPolicies(new ManagePolicyHandler())
  @UseInterceptors(FileInterceptor('thumbnail'))
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() thumbnail: Express.Multer.File,
    @Res() res: Response,
  ): Promise<Response> {
    const { buffer } = thumbnail;

    if (thumbnail.size > 20000000) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        reason: 'INVALID_INPUT',
        message: 'Image size is too large',
      });
    }

    if (
      thumbnail.mimetype !== 'image/png' &&
      thumbnail.mimetype !== 'image/jpeg' &&
      thumbnail.mimetype !== 'image/gif'
    ) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        reason: 'INVALID_INPUT',
        message: 'Must be a png or jpeg image',
      });
    }

    const targetItem = await this.itemService.findOne(+id);
    const item = await this.itemService.uploadThumbnail(targetItem, buffer);
    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'Successfully upload item thumbnail', item });
  }

  @ApiCreatedResponse({
    description: 'Successfully upload item thumbnail',
  })
  @Put(':id/file/upload')
  @CheckPolicies(new ManagePolicyHandler())
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ): Promise<Response> {
    const { buffer } = file;

    if (file.size > 50000000) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        reason: 'INVALID_INPUT',
        message: 'File size is too large',
      });
    }

    const targetItem = await this.itemService.findOne(+id);
    const item = await this.itemService.uploadFile(targetItem, file.originalname, buffer);
    return res.status(HttpStatus.CREATED).json({ message: 'Successfully upload file', item });
  }
}
