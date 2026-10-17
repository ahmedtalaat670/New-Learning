import { filterLabels, filters } from "@/app/_lib/constants/filters";
import { FilterKey } from "@/app/_lib/types/filter-key";
import { formatLabel } from "@/app/_lib/methods/form-label";
import { SelectedFilters } from "@/app/_lib/types/selected-filters";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Props = {
  selectedFilters: SelectedFilters;
  handleFilterChange: (
    key: FilterKey,
    option: string,
    checked: boolean,
  ) => void;
  handleApplyFilters: () => void;
  handleClearFilters: () => void;
};

export default function FiltersContent({
  selectedFilters,
  handleFilterChange,
  handleApplyFilters,
  handleClearFilters,
}: Props) {
  return (
    <>
      {/* Filters */}
      <div className="space-y-8">
        {(Object.keys(filters) as FilterKey[]).map((key) => (
          <div key={key} className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              {filterLabels[key]}
            </h3>

            <div className="space-y-3">
              {filters[key].map((option) => (
                <div key={option} className="flex items-center gap-3">
                  <Checkbox
                    id={`${key}-${option}`}
                    checked={selectedFilters[key].includes(option)}
                    onCheckedChange={(checked) =>
                      handleFilterChange(key, option, checked === true)
                    }
                  />

                  <Label
                    htmlFor={`${key}-${option}`}
                    className="cursor-pointer text-sm font-normal"
                  >
                    {formatLabel(option)}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 border-t pt-6">
        <Button
          type="button"
          onClick={handleApplyFilters}
          className="w-full bg-primary text-white hover:bg-primary/90"
        >
          Apply Filters
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleClearFilters}
          className="w-full"
        >
          Clear Filters
        </Button>
      </div>
    </>
  );
}
