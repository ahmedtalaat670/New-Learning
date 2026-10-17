import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CourseCategoryEnum,
  CourseLevelEnum,
  CoursePrimaryLanguageEnum,
  courseSchema,
} from "@/app/_lib/schemas/course.schema";
import { useCourseStore } from "@/app/_stores/useCourseStore";

const step1Schema = courseSchema.pick({
  title: true,
  subtitle: true,
  category: true,
  level: true,
  primaryLanguage: true,
});

type Step1Values = z.infer<typeof step1Schema>;

export default function Step1BasicInfo() {
  const { courseData, updateCourseData, nextStep } = useCourseStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      title: courseData.title || "",
      subtitle: courseData.subtitle || "",
      category: courseData.category || CourseCategoryEnum.WEB_DEVELOPMENT,
      level: courseData.level || CourseLevelEnum.BEGINNER,
      primaryLanguage:
        courseData.primaryLanguage || CoursePrimaryLanguageEnum.ENGLISH,
    },
  });

  const onSubmit = (data: Step1Values) => {
    updateCourseData(data);
    nextStep();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5"
    >
      <h2 className="text-lg font-semibold text-gray-900 border-b pb-3">
        Step 1: Basic Information
      </h2>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Course Title *
        </label>
        <input
          type="text"
          placeholder="e.g. Introduction to NestJS Microservices"
          {...register("title")}
          className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-primary"
        />
        {errors.title && (
          <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Subtitle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Subtitle *
        </label>
        <input
          type="text"
          placeholder="e.g. Build scalable backend applications with confidence."
          {...register("subtitle")}
          className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-primary"
        />
        {errors.subtitle && (
          <p className="text-xs text-red-600 mt-1">{errors.subtitle.message}</p>
        )}
      </div>

      {/* Select Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            {...register("category")}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-primary"
          >
            {Object.values(CourseCategoryEnum).map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace("-", " ").toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty Level *
          </label>
          <select
            {...register("level")}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-primary"
          >
            {Object.values(CourseLevelEnum).map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl.replace("-", " ").toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Language *
          </label>
          <select
            {...register("primaryLanguage")}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-primary"
          >
            {Object.values(CoursePrimaryLanguageEnum).map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="px-6 py-2.5 text-sm font-medium text-white bg-primary hover:bg-[#e08300] rounded-lg shadow-sm transition"
        >
          Continue &rarr;
        </button>
      </div>
    </form>
  );
}
