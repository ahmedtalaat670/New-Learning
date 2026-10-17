import { notFound } from "next/navigation";
import { Course } from "../types/course";

export async function getCourse(courseId: string): Promise<Course> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}`,
    {
      cache: "no-store",
    },
  );

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("Failed to fetch course");
  }

  return response.json();
}
