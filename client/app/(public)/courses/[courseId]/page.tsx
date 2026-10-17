import Image from "next/image";
import { BookOpen, CheckCircle2, Globe2, GraduationCap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import CoursePreview from "@/components/CoursePreview";
import { Metadata } from "next";
import { formatLabel } from "@/app/_lib/methods/form-label";
import { getCourse } from "@/app/_lib/api-methods/get-course";
import { getCourseLectures } from "@/app/_lib/api-methods/get-course-lectures";
import { formatPrice } from "@/app/_lib/methods/format-price";
import PayPalButton from "../_components/PaypalButton";

interface PageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { courseId } = await params;

  const course = await getCourse(courseId);

  return {
    title: course.title,
    description:
      course.description ||
      "Learn essential skills with this expert-led course on CourseHub.",
    openGraph: {
      title: `${course.title} | SkillBridge`,
      description: course.description,
      type: "website",
      images: [
        {
          url: course.image,
          width: 1200,
          height: 630,
          alt: course.title,
        },
      ],
    },
  };
}

export default async function CoursePage({ params }: PageProps) {
  const { courseId } = await params;

  const [course, lectures] = await Promise.all([
    getCourse(courseId),
    getCourseLectures(courseId),
  ]);
  return (
    <main className="bg-background">
      {/* ==================== HERO ==================== */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
            {/* Course information */}
            <div className="flex flex-col justify-center">
              {/* Badges */}
              <div className="mb-5 flex flex-wrap gap-2">
                <Badge className="bg-primary text-white hover:bg-primary/90">
                  {formatLabel(course.category)}
                </Badge>

                <Badge variant="secondary">{formatLabel(course.level)}</Badge>
              </div>

              {/* Title */}
              <h1 className="max-w-4xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {course.title}
              </h1>

              {/* Subtitle */}
              <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
                {course.subtitle}
              </p>

              {/* Course metadata */}
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="h-5 w-5 text-primary" />

                  <span>
                    {lectures.length}{" "}
                    {lectures.length === 1 ? "Lecture" : "Lectures"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <GraduationCap className="h-5 w-5 text-primary" />

                  <span>{formatLabel(course.level)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe2 className="h-5 w-5 text-primary" />

                  <span>{formatLabel(course.primaryLanguage)}</span>
                </div>
              </div>
            </div>

            {/* ==================== PURCHASE CARD ==================== */}
            <div className="h-fit overflow-hidden rounded-2xl border bg-white shadow-sm">
              {/* Image */}
              <div className="relative aspect-video">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              {/* Price + Buy */}
              <div className="space-y-5 p-6">
                <div>
                  <p className="text-sm text-muted-foreground">Course Price</p>

                  <p className="mt-1 text-3xl font-bold">
                    {formatPrice(course.pricing)}
                  </p>
                </div>

                <PayPalButton
                  courseId={course.id}
                  clientId={process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!}
                />

                <p className="text-center text-xs text-muted-foreground">
                  Get access to all lectures after purchase.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CONTENT ==================== */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_350px]">
          {/* Main content */}
          <div className="space-y-12">
            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold">About This Course</h2>

              <p className="mt-4 max-w-4xl leading-8 text-muted-foreground">
                {course.description}
              </p>
            </section>

            {/* Objectives */}
            <section>
              <h2 className="text-2xl font-bold">What You Will Learn</h2>

              <div className="mt-6 rounded-xl border bg-white p-6">
                <div className="flex gap-4">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />

                  <p className="leading-7 text-muted-foreground">
                    {course.objectives}
                  </p>
                </div>
              </div>
            </section>

            {/* Welcome */}
            <section>
              <h2 className="text-2xl font-bold">Welcome Message</h2>

              <div className="mt-5 rounded-xl bg-primary/5 p-6">
                <p className="leading-8 text-muted-foreground">
                  {course.welcomeMessage}
                </p>
              </div>
            </section>

            {/* ==================== LECTURES ==================== */}
            <CoursePreview lectures={lectures} />
          </div>

          {/* ==================== SIDEBAR ==================== */}
          <aside className="h-fit rounded-xl border bg-white p-6 lg:sticky lg:top-24">
            <h3 className="text-lg font-bold">Course Information</h3>

            <div className="mt-6 space-y-5">
              {/* Category */}
              <div className="flex items-start justify-between gap-4">
                <span className="text-sm text-muted-foreground">Category</span>

                <span className="text-right text-sm font-medium">
                  {formatLabel(course.category)}
                </span>
              </div>

              {/* Level */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-muted-foreground">Level</span>

                <span className="text-sm font-medium">
                  {formatLabel(course.level)}
                </span>
              </div>

              {/* Language */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-muted-foreground">Language</span>

                <span className="text-sm font-medium">
                  {formatLabel(course.primaryLanguage)}
                </span>
              </div>

              {/* Lectures */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-muted-foreground">Lectures</span>

                <span className="text-sm font-medium">{lectures.length}</span>
              </div>
            </div>

            {/* Price */}
            <div className="mt-6 border-t pt-6">
              <p className="text-sm text-muted-foreground">Price</p>

              <p className="mt-1 text-2xl font-bold">
                {formatPrice(course.pricing)}
              </p>

              <PayPalButton
                courseId={course.id}
                clientId={process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!}
              />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
