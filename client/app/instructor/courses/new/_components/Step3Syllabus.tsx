/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  CourseFormValues,
  courseSchema,
} from "@/app/_lib/schemas/course.schema";
import { useCourseStore } from "@/app/_stores/useCourseStore";
import { z } from "zod";
import LectureVideoManager from "../../_components/LectureVideoManager";

const step3Schema = courseSchema.pick({
  description: true,
  objectives: true,
  welcomeMessage: true,
  lectures: true,
});

type Step3InputValues = z.input<typeof step3Schema>;
type Step3OutputValues = z.output<typeof step3Schema>;

export default function Step3Syllabus() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { courseData, updateCourseData, prevStep, resetCourseData } =
    useCourseStore();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<Step3InputValues, any, Step3OutputValues>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      description: courseData.description || "",
      objectives: courseData.objectives || "",
      welcomeMessage: courseData.welcomeMessage || "",
      lectures: courseData.lectures || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lectures",
  });

  const onSubmit = async (data: Step3OutputValues) => {
    try {
      setIsSubmitting(true);
      setServerError(null);

      const finalPayload: CourseFormValues = {
        ...courseData,
        ...data,
      } as CourseFormValues;

      const formattedPayload = {
        ...finalPayload,
        pricing: Math.round(Number(finalPayload.pricing) * 100),
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formattedPayload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create course");
      }

      resetCourseData();
      router.push("/instructor/courses");
      router.refresh();
    } catch (err: any) {
      setServerError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6"
    >
      <h2 className="text-lg font-semibold text-gray-900 border-b pb-3">
        Step 3: Details & Syllabus
      </h2>

      {serverError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {serverError}
        </div>
      )}

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Course Description *
        </label>
        <textarea
          rows={4}
          placeholder="In this course, you will learn..."
          {...register("description")}
          className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-primary"
        />
        {errors.description && (
          <p className="text-xs text-red-600 mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Objectives */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Course Objectives *
        </label>
        <input
          type="text"
          placeholder="Design modular systems, write unit tests..."
          {...register("objectives")}
          className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-primary"
        />
        {errors.objectives && (
          <p className="text-xs text-red-600 mt-1">
            {errors.objectives.message}
          </p>
        )}
      </div>

      {/* Welcome Message */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Welcome Message *
        </label>
        <textarea
          rows={2}
          placeholder="Welcome aboard! Get ready to level up..."
          {...register("welcomeMessage")}
          className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-primary"
        />
        {errors.welcomeMessage && (
          <p className="text-xs text-red-600 mt-1">
            {errors.welcomeMessage.message}
          </p>
        )}
      </div>

      {/* Lectures Array */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900">
            Lectures Curriculum
          </h3>
          <button
            type="button"
            onClick={() => append({ title: "", freePreview: false, video: "" })}
            className="px-3 py-1.5 text-xs font-semibold text-primary bg-amber-50 hover:bg-amber-100 rounded-lg transition"
          >
            + Add Lecture
          </button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700">
                  Lecture #{index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>

              <input
                type="text"
                placeholder="Lecture Title"
                {...register(`lectures.${index}.title`)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white"
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`preview-${index}`}
                  {...register(`lectures.${index}.freePreview`)}
                  className="h-4 w-4 text-primary border-gray-300 rounded"
                />
                <label
                  htmlFor={`preview-${index}`}
                  className="text-xs text-gray-600 cursor-pointer"
                >
                  Allow Free Preview
                </label>
              </div>

              <Controller
                control={control}
                name={`lectures.${index}.video`}
                render={({ field }) => (
                  <LectureVideoManager
                    initialVideoUrl={field.value}
                    onVideoChange={({ path }) =>
                      setValue(`lectures.${index}.video`, path)
                    }
                  />
                )}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={() => {
            updateCourseData(control._formValues);
            prevStep();
          }}
          disabled={isSubmitting}
          className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 text-sm font-medium text-white bg-primary hover:bg-[#e08300] rounded-lg shadow-sm transition disabled:opacity-50"
        >
          {isSubmitting ? "Creating Course..." : "Submit & Create Course"}
        </button>
      </div>
    </form>
  );
}
