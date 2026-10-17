import Image from "next/image";
import Link from "next/link";
import { CustomPagination } from "@/components/CustomPagination";
import { Metadata } from "next";
import { getInstructorCourses } from "@/app/_lib/api-methods/get-instructor-courses";
import { formatLabel } from "@/app/_lib/methods/form-label";
import { formatPrice } from "@/app/_lib/methods/format-price";
import CourseCardActions from "./_components/CourseCardActions";

export const metadata: Metadata = {
  title: "Instructor Courses",
  description:
    "Manage, edit, and publish your online courses and lectures. Track enrollment and performance on your SkillBridge instructor dashboard.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Instructor Courses | SkillBridge",
    description:
      "Manage and update your curriculum, track student performance, and publish new lectures on SkillBridge.",
    type: "website",
  },
};

export default async function InstructorCoursesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const { data: courses, meta } = await getInstructorCourses(page);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your created courses, track status, and upload new content.
          </p>
        </div>
        <Link
          href="/instructor/courses/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-[#e08300] text-white text-sm font-medium rounded-lg shadow-sm transition"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create New Course
        </Link>
      </div>

      {/* Empty State */}
      {courses.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <h3 className="mt-3 text-sm font-semibold text-gray-900">
            No courses created yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first course.
          </p>
          <div className="mt-6">
            <Link
              href="/instructor/courses/new"
              className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-[#e08300] transition"
            >
              New Course
            </Link>
          </div>
        </div>
      )}

      {/* Courses Grid */}
      {courses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
            >
              {/* Image & Status Badge */}
              <div className="relative w-full h-48 bg-gray-100">
                {course.image ? (
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Preview Image
                  </div>
                )}
                <span
                  className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold rounded-full border shadow-sm ${
                    course.isPublished
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {course.isPublished ? "Published" : "Draft"}
                </span>
              </div>

              {/* Course Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span className="capitalize">
                      {formatLabel(course.category)}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {formatPrice(course.pricing)}{" "}
                      <span className="text-primary text-lg">EGP</span>
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                    {formatLabel(course.title)}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {course.subtitle || course.description}
                  </p>
                </div>

                <CourseCardActions
                  courseId={course.id}
                  courseTitle={course.title}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Pagination Component */}
      <CustomPagination
        currentPage={meta.currentPage}
        totalPages={meta.totalPages}
      />
    </div>
  );
}
