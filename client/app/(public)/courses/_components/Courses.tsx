import { CoursesResponse } from "@/app/_lib/types/course";
import { CoursesSearchParams } from "@/app/_lib/types/coursesSearchParams";
import { CustomPagination } from "@/components/CustomPagination";
import CourseCard from "./CourseCard";

export default async function Courses({ searchParams }: CoursesSearchParams) {
  const params = await searchParams;

  const backendParams = new URLSearchParams();

  const filterKeys = ["category", "level", "primaryLanguage"] as const;

  for (const key of filterKeys) {
    const values = params[key];

    if (!values) continue;

    const normalizedValues = Array.isArray(values) ? values : [values];

    for (const value of normalizedValues) {
      backendParams.append(key, value);
    }
  }

  const queryString = backendParams.toString();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/courses${queryString ? `?${queryString}` : ""}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }

  const data: CoursesResponse = await response.json();

  return (
    <section className="w-full">
      {data.data.length === 0 ? (
        <div className="flex min-h-64 items-center justify-center rounded-xl border bg-white">
          <p className="text-muted-foreground">
            No courses found matching your filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {data.data.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
      {data.meta.totalPages > 1 && (
        <div>
          <CustomPagination
            totalPages={data.meta.totalPages}
            currentPage={data.meta.currentPage}
          />
        </div>
      )}
    </section>
  );
}
