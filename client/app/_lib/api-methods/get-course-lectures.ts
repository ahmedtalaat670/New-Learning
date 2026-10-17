import { Lecture } from "../types/lecture";

export async function getCourseLectures(courseId: string): Promise<Lecture[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/lectures?courseId=${courseId}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch course lectures");
  }

  return response.json();
}
