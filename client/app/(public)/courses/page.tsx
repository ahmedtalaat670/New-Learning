import { CoursesSearchParams } from "@/app/_lib/types/coursesSearchParams";
import { Metadata } from "next";
import CourseFilters from "./_components/Courses-filters";
import Courses from "./_components/Courses";

export const metadata: Metadata = {
  title: "Explore Courses",
  description:
    "Browse our extensive catalog of top-rated online courses, taught by expert instructors.",
  openGraph: {
    title: "Explore Courses | SkillBridge",
    description: "Browse our extensive catalog of top-rated online courses.",
  },
};

export default async function CoursesPage({
  searchParams,
}: CoursesSearchParams) {
  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-4">
        <CourseFilters />

        <section className="lg:col-span-3">
          <Courses searchParams={searchParams} />
        </section>
      </div>
    </main>
  );
}
