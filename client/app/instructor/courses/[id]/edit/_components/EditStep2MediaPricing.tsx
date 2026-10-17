/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEditCourseStore } from "@/app/_stores/useEditCourseStore";
import {
  courseSchema,
  CourseFormValues,
} from "@/app/_lib/schemas/course.schema";
import { Course } from "@/app/_lib/types/course";
import CourseImageManager from "../../../_components/CourseImageManager";

const step2Schema = courseSchema.pick({
  pricing: true,
  image: true,
});

type Step2InputValues = z.input<typeof step2Schema>;
type Step2OutputValues = z.output<typeof step2Schema>;

interface EditStep2MediaPricingProps {
  initialCourse: Course;
}

export default function EditStep2MediaPricing({
  initialCourse,
}: EditStep2MediaPricingProps) {
  const { courseData, updateCourseData, nextStep, prevStep } =
    useEditCourseStore();

  const defaultPrice =
    courseData.pricing ??
    (initialCourse.pricing ? initialCourse.pricing / 100 : 0);
  const defaultImage = courseData.image || initialCourse.image || "";

  const {
    register,
    handleSubmit,
    getValues,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Step2InputValues, any, Step2OutputValues>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      pricing: defaultPrice,
      image: defaultImage,
    },
  });

  useEffect(() => {
    reset({
      pricing: defaultPrice,
      image: defaultImage,
    });
  }, [defaultPrice, defaultImage, reset]);

  const onSubmit = (data: Step2OutputValues) => {
    updateCourseData(data);
    nextStep();
  };

  const handleBack = () => {
    updateCourseData(getValues() as Partial<CourseFormValues>);
    prevStep();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6"
    >
      <h2 className="text-lg font-semibold text-gray-900 border-b pb-3">
        Step 2: Media & Pricing
      </h2>

      {/* Pricing Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Course Price (USD $) *
        </label>
        <input
          type="number"
          step="0.01"
          placeholder="49.99"
          {...register("pricing")}
          className="w-full max-w-xs px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-primary"
        />
        {errors.pricing && (
          <p className="text-xs text-red-600 mt-1">{errors.pricing.message}</p>
        )}
      </div>

      {/* Course Image Manager */}
      <div>
        <Controller
          control={control}
          name="image"
          render={({ field }) => (
            <CourseImageManager
              initialImageUrl={field.value}
              onImageChange={({ path }) =>
                setValue("image", path, { shouldValidate: true })
              }
            />
          )}
        />
        {errors.image && (
          <p className="text-xs text-red-600 mt-1">{errors.image.message}</p>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={handleBack}
          className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          Back
        </button>
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
