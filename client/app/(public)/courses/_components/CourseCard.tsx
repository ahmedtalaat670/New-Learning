import { formatLabel } from "@/app/_lib/methods/form-label";
import { formatPrice } from "@/app/_lib/methods/format-price";
import { Course } from "@/app/_lib/types/course";
import Image from "next/image";
import Link from "next/link";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <article className="group overflow-hidden rounded-xl border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Image */}
      <Link href={`/courses/${course.id}`}>
        <div className="relative aspect-video overflow-hidden bg-muted">
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="space-y-4 p-5">
        {/* Category / Level */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {formatLabel(course.category)}
          </span>

          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            {formatLabel(course.level)}
          </span>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Link href={`/courses/${course.id}`}>
            <h2 className="line-clamp-2 text-lg font-bold text-foreground transition-colors group-hover:text-primary">
              {course.title}
            </h2>
          </Link>

          <p className="line-clamp-2 text-sm text-muted-foreground">
            {course.subtitle}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t pt-4">
          <span className="text-lg font-bold text-primary">
            {formatPrice(course.pricing)}
          </span>

          <span className="text-sm capitalize text-muted-foreground">
            {formatLabel(course.primaryLanguage)}
          </span>
        </div>
      </div>
    </article>
  );
}
