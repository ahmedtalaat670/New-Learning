import {
  Controller,
  Delete,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadsService } from './providers/uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoles } from 'src/users/enums/user-roles.enum';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { fileTypes } from './enums/file-types.enum';

@ApiTags('Uploads')
@ApiBearerAuth()
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post('video')
  @Roles(UserRoles.INSTRUCTOR)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload a course video lecture',
    description:
      'Allows authenticated instructors to upload lecture videos. Maximum file size allowed is 50MB.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description:
            'The video asset binary file (video/mp4, video/mpeg, video/webm, video/quicktime.)',
        },
      },
      required: ['file'],
    },
  })
  @ApiCreatedResponse({
    description: 'you uploaded video successfully',
    schema: {
      items: {
        properties: {
          id: { type: 'string', example: 'asdd-dwes-323' },
          name: { type: 'string', example: 'lecture video' },
          path: { type: 'string', example: 'video url' },
          type: { type: 'string', example: fileTypes.VIDEO },
          size: { type: 'number', example: 1024 },
          mime: { type: 'string', example: 'video/mp4' },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Validation failed. File missing or exceeds the 50MB ceiling limit.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource. Instructors only.',
  })
  public uploadVideo(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 50 * 1024 * 1024 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.uploadsService.uploadVideo(file);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('image')
  @Roles(UserRoles.INSTRUCTOR)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload a course thumbnail image',
    description:
      'Allows authenticated instructors to upload course promo images. Maximum file size allowed is 5MB.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description:
            'The image file (image/gif,image/jpeg,image/jpg,image/png,)',
        },
      },
      required: ['file'],
    },
  })
  @ApiCreatedResponse({
    description: 'you uploaded images successfully',
    schema: {
      items: {
        properties: {
          id: { type: 'string', example: 'asdd-dwes-323' },
          name: { type: 'string', example: 'course image' },
          path: { type: 'string', example: 'image url' },
          type: { type: 'string', example: fileTypes.IMAGE },
          size: { type: 'number', example: 1024 },
          mime: { type: 'string', example: 'image/png' },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Validation failed. File missing or exceeds the 5MB ceiling limit.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource. Instructors only.',
  })
  public uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.uploadsService.uploadImage(file);
  }

  @Delete(':id')
  @Roles(UserRoles.INSTRUCTOR)
  @ApiOperation({
    summary: 'Delete an uploaded asset',
    description:
      'Removes a file from the server or object storage tracking registry using its tracking identifier string.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The unique storage tracking key or resource ID string',
  })
  @ApiResponse({ status: 200, description: 'Asset removed successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiResponse({
    status: 404,
    description:
      'Asset with the requested identifier tracking signature not found.',
  })
  public async deleteUpload(@Param('id') id: string) {
    return this.uploadsService.deleteUpload(id);
  }
}
