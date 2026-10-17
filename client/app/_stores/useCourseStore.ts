import { create } from "zustand";
import { CourseFormValues } from "../_lib/schemas/course.schema";

interface CourseState {
  step: number;
  courseData: Partial<CourseFormValues>;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateCourseData: (data: Partial<CourseFormValues>) => void;
  resetCourseData: () => void;
}

export const useCourseStore = create<CourseState>((set) => ({
  step: 1,
  courseData: {
    title: "",
    subtitle: "",
    category: undefined,
    level: undefined,
    primaryLanguage: undefined,
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
  updateCourseData: (data) =>
    set((state) => ({
      courseData: { ...state.courseData, ...data },
    })),
  resetCourseData: () =>
    set({
      step: 1,
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
