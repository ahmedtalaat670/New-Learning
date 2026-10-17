export interface Paginated<T> {
  data: T[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
  };
  links: {
    first?: string;
    previous?: string | null;
    current: string;
    next?: string | null;
    last?: string;
  };
}
