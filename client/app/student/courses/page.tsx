import { getStudentCourses } from "@/app/_lib/api-methods/get-student-courses";
import { StudentCourse } from "@/app/_lib/types/student-course";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My Courses",
  description:
    "Access your enrolled courses, track your learning progress, and continue building skills on SkillBridge.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "My Courses | SkillBridge",
    description:
      "Access your enrolled courses and continue your learning journey on SkillBridge.",
    type: "website",
  },
};

export default async function StudentCoursesPage() {
  const response = await getStudentCourses();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            My Courses
          </h1>
        </div>

        {response.data.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <h2 className="text-xl font-semibold text-slate-900">
              No courses yet
            </h2>

            <p className="mt-2 text-slate-500">
              You haven't purchased any courses yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {response.data.map((studentCourse: StudentCourse) => (
              <article
                key={studentCourse.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="aspect-video bg-slate-100">
                  {studentCourse.course.image && (
                    <Image
                      width={100}
                      height={100}
                      src={studentCourse.course.image}
                      alt={studentCourse.course.title}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                      {studentCourse.course.category}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {studentCourse.course.level}
                    </span>
                  </div>

                  <h2 className="line-clamp-2 text-lg font-semibold text-slate-900">
                    {studentCourse.course.title}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                    {studentCourse.course.subtitle}
                  </p>

                  <Link
                    href={`/student/courses/${studentCourse.course.id}/lectures`}
                  >
                    <button
                      type="button"
                      className="mt-5 w-full rounded-lg bg-primary px-4 py-2.5 font-medium text-white transition hover:bg-[#e68600]"
                    >
                      Continue Learning
                    </button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
