import { z } from "zod";

export enum CourseCategoryEnum {
  WEB_DEVELOPMENT = "web-development",
  BACKEND_DEVELOPMENT = "backend-development",
  DATA_SCIENCE = "data-science",
  ARTIFICIAL_INTELLIGENCE = "artificial-intelligence",
  CLOUD_COMPUTING = "cloud-computing",
  CYBER_SECURITY = "cyber-security",
  MOBILE_DEVELOPMENT = "mobile-development",
  GAME_DEVELOPMENT = "game-development",
  SOFTWARE_ENGINEERING = "software-engineering",
}

export enum CourseLevelEnum {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}

export enum CoursePrimaryLanguageEnum {
  ENGLISH = "english",
  SPANISH = "spanish",
  FRENCH = "french",
  GERMAN = "german",
  CHINESE = "chinese",
  JAPANESE = "japanese",
  KOREAN = "korean",
  PORTUGUESE = "protuguese",
  ARABIC = "arabic",
  RUSSIAN = "russian",
}

const categoryValues = Object.values(CourseCategoryEnum) as [
  string,
  ...string[],
];
const levelValues = Object.values(CourseLevelEnum) as [string, ...string[]];
const languageValues = Object.values(CoursePrimaryLanguageEnum) as [
  string,
  ...string[],
];

export const createLectureSchema = z.object({
  id: z.number().optional(),
  title: z
    .string()
    .min(3, { message: "Lecture title must be at least 3 characters" })
    .max(96, { message: "Lecture title cannot exceed 96 characters" }),
  freePreview: z.boolean().default(false),
  video: z.string().min(1, { message: "Lecture video URL is required" }),
});

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(96, { message: "Title cannot exceed 96 characters" }),

  category: z.enum(categoryValues, {
    message: "Please select a valid course category",
  }),

  level: z.enum(levelValues, {
    message: "Please select a valid difficulty level",
  }),

  primaryLanguage: z.enum(languageValues, {
    message: "Please select a valid primary language",
  }),

  subtitle: z
    .string()
    .min(3, { message: "Subtitle must be at least 3 characters" })
    .max(50, { message: "Subtitle cannot exceed 50 characters" }),

  description: z.string().min(1, { message: "Course description is required" }),

  pricing: z.coerce
    .number({ message: "Price must be a valid number" })
    .min(0, { message: "Price cannot be negative" }),

  objectives: z.string().min(1, { message: "Course objectives are required" }),

  welcomeMessage: z.string().min(1, { message: "Welcome message is required" }),

  image: z.string().min(1, { message: "Course thumbnail image is required" }),

  isPublished: z.boolean().optional().default(false),

  lectures: z.array(createLectureSchema).optional().default([]),
});

export type CreateLectureFormValues = z.infer<typeof createLectureSchema>;
export type CourseFormValues = z.infer<typeof courseSchema>;
