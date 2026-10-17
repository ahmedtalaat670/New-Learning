import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { LecturesService } from './providers/lectures.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { LectureDto } from './dtos/lecture.dto';

@ApiTags('lectures')
@Controller('lectures')
export class LecturesController {
  constructor(private readonly lectureService: LecturesService) {}
  @Get()
  @Auth(AuthType.None)
  @ApiQuery({
    name: 'courseId',
    type: Number,
    required: true,
    description: 'The ID of the course to retrieve lectures for',
    example: 12,
  })
  @ApiOkResponse({
    description: 'Successfully retrieved the list of lectures.',
    type: [LectureDto],
  })
  public findAll(@Query('courseId', ParseIntPipe) courseId: number) {
    return this.lectureService.findAll(courseId);
  }
}
