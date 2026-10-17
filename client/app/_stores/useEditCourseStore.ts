import { create } from "zustand";
import { CourseFormValues } from "@/app/_lib/schemas/course.schema";
import { Course } from "../_lib/types/course";

interface EditCourseState {
  step: number;
  courseId: string | null;
  courseData: Partial<CourseFormValues>;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  initEditCourse: (id: string, course: Course) => void;
  updateCourseData: (data: Partial<CourseFormValues>) => void;
  resetEditCourse: () => void;
}

export const useEditCourseStore = create<EditCourseState>((set) => ({
  step: 1,
  courseId: null,
  courseData: {
    title: "",
    subtitle: "",
    pricing: 0,
    description: "",
    objectives: "",
    welcomeMessage: "",
    image: "",
    isPublished: false,
    lectures: [],
  },

  setStep: (step) => set({ step }),

  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 3) })),

  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),

  initEditCourse: (id, course) =>
    set({
      courseId: id,
      step: 1,
      courseData: {
        title: course.title,
        subtitle: course.subtitle,
        category: course.category,
        level: course.level,
        primaryLanguage: course.primaryLanguage,
        pricing: course.pricing ? course.pricing / 100 : 0,
        description: course.description,
        objectives: course.objectives,
        welcomeMessage: course.welcomeMessage,
        image: course.image,
        isPublished: course.isPublished,
        lectures: course.lectures || [],
      },
    }),

  updateCourseData: (data) =>
    set((state) => ({
      courseData: { ...state.courseData, ...data },
    })),

  resetEditCourse: () =>
    set({
      step: 1,
      courseId: null,
      courseData: {
        title: "",
        subtitle: "",
        pricing: 0,
        description: "",
        objectives: "",
        welcomeMessage: "",
        image: "",
        isPublished: false,
        lectures: [],
      },
    }),
}));
