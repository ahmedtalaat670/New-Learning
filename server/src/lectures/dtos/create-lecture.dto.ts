import { IsBoolean, IsString, Length, MaxLength } from 'class-validator';

export class CreateLectureDto {
  @IsString()
  @Length(3, 96)
  title!: string;

  @IsBoolean()
  freePreview!: boolean;

  @IsString()
  @MaxLength(512)
  video!: string;
}
