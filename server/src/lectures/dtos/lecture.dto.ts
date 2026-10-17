import { ApiProperty } from '@nestjs/swagger';

export class LectureDto {
  @ApiProperty({
    description: 'The unique identifier of the lecture',
    example: 4,
  })
  id!: number;

  @ApiProperty({
    description: 'The title of the lecture',
    example: 'lecture title',
  })
  title!: string;

  @ApiProperty({
    description: 'Indicates if the lecture is available as a free preview',
    example: true,
  })
  freePreview!: boolean;

  @ApiProperty({
    description: 'The URL or identifier of the video',
    example: 'lecture url',
  })
  video!: string;
}
