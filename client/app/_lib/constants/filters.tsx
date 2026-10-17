import { SelectedFilters } from "../types/selected-filters";

export const filters = {
  category: [
    "web-development",
    "backend-development",
    "data-science",
    "artificial-intelligence",
    "cloud-computing",
    "cyber-security",
    "mobile-development",
    "game-development",
    "software-engineering",
  ],

  level: ["beginner", "intermediate", "advanced"],

  primaryLanguage: [
    "english",
    "spanish",
    "french",
    "german",
    "chinese",
    "japanese",
    "korean",
    "portuguese",
    "arabic",
    "russian",
  ],
};

export const filterLabels = {
  category: "Category",
  level: "Level",
  primaryLanguage: "Primary Language",
};

export const emptyFilters: SelectedFilters = {
  category: [],
  level: [],
  primaryLanguage: [],
};
