import { cookies } from "next/headers";
import { Course } from "../types/course";
import { PaginatedResponse } from "../types/pagination";

export async function getInstructorCourses(
  page: number = 1,
): Promise<PaginatedResponse<Course>> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/courses/instructor-courses?page=${page}&limit=10`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    console.log(response);
    throw new Error("Failed to fetch instructor courses");
  }

  return response.json();
}
