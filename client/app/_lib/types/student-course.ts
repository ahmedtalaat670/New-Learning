import { Course } from "./course";

export type StudentCourse = {
  id: number;
  course: Course;
  dateOfPurchase: Date;
  createdAt: Date;
};
