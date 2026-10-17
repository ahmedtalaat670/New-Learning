"use client";

import Link from "next/link";

import { useCourseStore } from "@/app/_stores/useCourseStore";
import { useEffect } from "react";
import Step1BasicInfo from "./_components/Step1BasicInfo";
import Step2MediaPricing from "./_components/Step2MediaPricing";
import Step3Syllabus from "./_components/Step3Syllabus";

const STEPS = [
  { id: 1, title: "Basic Info", description: "Title & category" },
  { id: 2, title: "Media & Pricing", description: "Thumbnail & price" },
  { id: 3, title: "Details & Syllabus", description: "Description & lectures" },
];

export default function CreateCoursePage() {
  const step = useCourseStore((state) => state.step);
  useEffect(() => {
    document.title = "Create Course | SkillBridge";
  }, []);
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Create New Course
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Complete the steps below to configure your course.
          </p>
        </div>
        <Link
          href="/instructor/courses"
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
        >
          &larr; Back to Courses
        </Link>
      </div>

      {/* Stepper Header Navigation */}
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

      {/* Dynamic Step Component Rendering */}
      {step === 1 && <Step1BasicInfo />}
      {step === 2 && <Step2MediaPricing />}
      {step === 3 && <Step3Syllabus />}
    </div>
  );
}
