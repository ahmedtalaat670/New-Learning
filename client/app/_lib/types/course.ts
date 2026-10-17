import { Lecture } from "./lecture";
import { PaginatedResponse } from "./pagination";

export interface Course {
  id: number;
  title: string;
  category: string;
  level: string;
  primaryLanguage: string;
  subtitle: string;
  description: string;
  pricing: number;
  objectives: string;
  welcomeMessage: string;
  image: string;
  isPublished: boolean;
  lectures: Lecture[];
}

export type CoursesResponse = PaginatedResponse<Course>;
