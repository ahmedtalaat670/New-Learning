"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useEditCourseStore } from "@/app/_stores/useEditCourseStore";
import EditStep1BasicInfo from "./EditStep1BasicInfo";
import EditStep2MediaPricing from "./EditStep2MediaPricing";
import EditStep3Syllabus from "./EditStep3Syllabus";
import { Course } from "@/app/_lib/types/course";

const STEPS = [
  { id: 1, title: "Basic Info", description: "Title & category" },
  { id: 2, title: "Media & Pricing", description: "Thumbnail & price" },
  { id: 3, title: "Details & Syllabus", description: "Description & lectures" },
];

interface EditCourseWizardProps {
  initialCourse: Course;
  courseId: string;
}

export default function EditCourseWizard({
  initialCourse,
  courseId,
}: EditCourseWizardProps) {
  const { step, initEditCourse } = useEditCourseStore();

  useEffect(() => {
    initEditCourse(courseId, initialCourse);
  }, [courseId, initialCourse, initEditCourse]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Course</h1>
          <p className="text-sm text-gray-500 mt-1">
            Update your course details, pricing, and video curriculum.
          </p>
        </div>
        <Link
          href="/instructor/courses"
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
        >
          &larr; Back to Courses
        </Link>
      </div>

      {/* Stepper Navigation Indicator */}
      <div className="mb-8 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STEPS.map((s) => {
            const isActive = s.id === step;
            const isCompleted = s.id < step;

            return (
              <div
                key={s.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition ${
                  isActive
                    ? "border-primary bg-amber-50/50"
                    : isCompleted
                      ? "border-emerald-200 bg-emerald-50/30"
                      : "border-gray-100 bg-gray-50/50 opacity-60"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    isActive
                      ? "bg-primary text-white"
                      : isCompleted
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {isCompleted ? "✓" : s.id}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">{s.title}</h4>
                  <p className="text-[11px] text-gray-500 hidden sm:block">
                    {s.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pass initialCourse directly to the step components */}
      {step === 1 && <EditStep1BasicInfo initialCourse={initialCourse} />}
      {step === 2 && <EditStep2MediaPricing initialCourse={initialCourse} />}
      {step === 3 && (
        <EditStep3Syllabus courseId={courseId} initialCourse={initialCourse} />
      )}
    </div>
  );
}
