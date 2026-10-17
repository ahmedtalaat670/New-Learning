export interface CoursesSearchParams {
  searchParams: Promise<{
    category?: string | string[];
    level?: string | string[];
    primaryLanguage?: string | string[];
  }>;
}
