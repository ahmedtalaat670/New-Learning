import { SelectedFilters } from "../types/selected-filters";

export function getInitialFilters(
  searchParams: URLSearchParams,
): SelectedFilters {
  return {
    category: searchParams.getAll("category"),
    level: searchParams.getAll("level"),
    primaryLanguage: searchParams.getAll("primary_language"),
  };
}
