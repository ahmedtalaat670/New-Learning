import { cookies } from "next/headers";

export async function getStudentCourses() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/student-courses`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: cookieHeader,
      },
    },
  );
  if (!response.ok) {
    console.log(response);
    throw new Error("Failed to fetch your courses.");
  }
  return response.json();
}
