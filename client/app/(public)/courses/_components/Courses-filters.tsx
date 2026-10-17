"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { emptyFilters } from "@/app/_lib/constants/filters";
import { SelectedFilters } from "@/app/_lib/types/selected-filters";
import { getInitialFilters } from "@/app/_lib/methods/get-initial-filters";
import { FilterKey } from "@/app/_lib/types/filter-key";
import FiltersContent from "./FiltersContent";

export default function CourseFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>(() =>
    getInitialFilters(searchParams),
  );

  const [open, setOpen] = useState(false);

  const handleFilterChange = (
    key: FilterKey,
    value: string,
    checked: boolean,
  ) => {
    setSelectedFilters((previous) => {
      const currentValues = previous[key];

      if (checked) {
        if (currentValues.includes(value)) {
          return previous;
        }

        return {
          ...previous,
          [key]: [...currentValues, value],
        };
      }

      return {
        ...previous,
        [key]: currentValues.filter((item) => item !== value),
      };
    });
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams();

    for (const [key, values] of Object.entries(selectedFilters)) {
      for (const value of values) {
        params.append(key, value);
      }
    }

    const queryString = params.toString();

    router.push(queryString ? `${pathname}?${queryString}` : pathname);

    setOpen(false);
  };

  const handleClearFilters = () => {
    setSelectedFilters(emptyFilters);
    router.push(pathname);
    setOpen(false);
  };

  return (
    <>
      {/* Mobile & Tablet */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger>
            <div className="w-full sm:w-auto">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </div>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="w-[85%] overflow-y-auto sm:max-w-md"
          >
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>

            <div className="mt-6 px-1">
              <FiltersContent
                selectedFilters={selectedFilters}
                handleApplyFilters={handleApplyFilters}
                handleClearFilters={handleClearFilters}
                handleFilterChange={handleFilterChange}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop */}
      <aside className="hidden w-full rounded-xl border bg-white p-5 lg:sticky lg:top-24 lg:col-span-1 lg:block lg:p-6">
        <FiltersContent
          selectedFilters={selectedFilters}
          handleApplyFilters={handleApplyFilters}
          handleClearFilters={handleClearFilters}
          handleFilterChange={handleFilterChange}
        />
      </aside>
    </>
  );
}
