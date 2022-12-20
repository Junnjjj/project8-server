import {
  Controller,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../common/decorators/user.decorator';
import { User } from '../entity/user.entity';
import { MediaService } from './media.service';
import { RolesGuard } from '../auth/role/roles.guard';
import { RoleType } from '../auth/role-types';
import { Roles } from '../common/decorators/role.decorator';

@Controller('media')
export class MediaController {
  constructor(
    private storageService: StorageService,
    private mediaService: MediaService,
  ) {}

  @Post('upload/:productName')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('image', 5))
  // @UseInterceptors(
  //   FileInterceptor('image', {
  //     limits: {
  //       files: 1,
  //       fileSize: 1024 * 1024,
  //     },
  //   }),
  // )
  async uploadImg(
    @Param('productName') productName: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @CurrentUser() user: User,
  ) {
    const file = files[0];
    const imgName =
      file.fieldname + '_' + Math.round(Math.random() * 1e9) + '.jpg';

    await this.storageService.save(
      'media/product/' + user.name + '/' + imgName,
      file.mimetype,
      file.buffer,
      [{ mediaId: file.fieldname }],
    );

    await this.mediaService.saveProductImgToDB(imgName, user.name, productName);

    return imgName;
  }

  @Post('upload/news/:imgName')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  @UseInterceptors(FilesInterceptor('image', 1))
  async uploadNesImgtoGCP(
    @Param('imgName') imgName: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const file = files[0];
    const convertImgName =
      file.fieldname + '_' + Math.round(Math.random() * 1e9) + '.jpg';

    await this.storageService.save(
      'media/news/' + convertImgName,
      file.mimetype,
      file.buffer,
      [{ mediaId: file.fieldname }],
    );

    await this.mediaService.saveNewsImgToDB(convertImgName, imgName);

    return convertImgName;
  }
}
