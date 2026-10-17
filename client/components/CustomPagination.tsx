"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

type Props = {
  currentPage: number;
  totalPages: number;
};

export function CustomPagination({ currentPage, totalPages }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const handleOnClick = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <Pagination className="my-8">
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => !isFirstPage && handleOnClick(currentPage - 1)}
            aria-disabled={isFirstPage}
            className={
              isFirstPage
                ? "pointer-events-none opacity-50"
                : "cursor-pointer select-none"
            }
          />
        </PaginationItem>

        {/* Page -2 (Only shown when on the last page) */}
        {currentPage - 2 > 0 && isLastPage && (
          <PaginationItem>
            <PaginationLink
              onClick={() => handleOnClick(currentPage - 2)}
              className="cursor-pointer select-none"
            >
              {currentPage - 2}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Page -1 */}
        {currentPage - 1 > 0 && (
          <PaginationItem>
            <PaginationLink
              onClick={() => handleOnClick(currentPage - 1)}
              className="cursor-pointer select-none"
            >
              {currentPage - 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Current Active Page */}
        <PaginationItem>
          <PaginationLink
            isActive
            className="bg-primary text-white hover:bg-[#e08300] hover:text-white cursor-default"
          >
            {currentPage}
          </PaginationLink>
        </PaginationItem>

        {/* Page +1 */}
        {currentPage + 1 <= totalPages && (
          <PaginationItem>
            <PaginationLink
              onClick={() => handleOnClick(currentPage + 1)}
              className="cursor-pointer select-none"
            >
              {currentPage + 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Page +2 (Only shown when on the first page) */}
        {currentPage + 2 <= totalPages && isFirstPage && (
          <PaginationItem>
            <PaginationLink
              onClick={() => handleOnClick(currentPage + 2)}
              className="cursor-pointer select-none"
            >
              {currentPage + 2}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            onClick={() => !isLastPage && handleOnClick(currentPage + 1)}
            aria-disabled={isLastPage}
            className={
              isLastPage
                ? "pointer-events-none opacity-50"
                : "cursor-pointer select-none"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
