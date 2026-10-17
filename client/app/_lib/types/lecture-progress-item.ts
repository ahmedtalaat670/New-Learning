import { CourseProgressInfo } from "./course-progress";
import { Lecture } from "./lecture";

export interface LectureProgressItem {
  id: number;
  courseProgress: CourseProgressInfo;
  userId: string;
  viewDate: Date;
  lecture: Lecture;
}
