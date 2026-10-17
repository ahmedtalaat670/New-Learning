import { notFound } from "next/navigation";
import EditCourseWizard from "./_components/EditCourseWizard";
import { Metadata } from "next";
import { getCourse } from "@/app/_lib/api-methods/get-course";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const course = await getCourse(id);

    return {
      title: `Edit: ${course.title}`,
      description: `Edit course details, syllabus, media, and pricing for ${course.title} on SkillBridge.`,
      robots: {
        index: false,
        follow: false,
      },
      openGraph: {
        title: `Edit: ${course.title} | SkillBridge`,
        description: `Manage syllabus, pricing, and media settings.`,
        type: "website",
      },
    };
  } catch (error) {
    return {
      title: "Edit Course",
      robots: { index: false, follow: false },
    };
  }
}

export default async function EditCoursePage({ params }: PageProps) {
  const resolvedParams = await params;
  const course = await getCourse(resolvedParams.id);

  if (!course) {
    notFound();
  }

  return (
    <EditCourseWizard initialCourse={course} courseId={resolvedParams.id} />
  );
}
