"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuthStore } from "@/app/_stores/auth";
import { NavigationContent } from "./InstructorNavigationContent";
import { handleLogout } from "@/app/_lib/methods/handle-logout";

export default function InstructorSidebar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const clearAuth = useAuthStore((state) => state.clearAuth);

  return (
    <>
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Instructor Portal
        </span>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger>
            <div
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              aria-label="Open navigation menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </div>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="w-64 p-6 flex flex-col justify-between"
          >
            <SheetHeader className="text-left border-b border-gray-100 pb-4">
              <SheetTitle className="text-xs font-bold uppercase tracking-wider text-primary">
                Instructor Portal
              </SheetTitle>
            </SheetHeader>
            <NavigationContent
              handleLogout={() => handleLogout(clearAuth, router)}
            />
          </SheetContent>
        </Sheet>
      </div>

      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col h-screen shrink-0 sticky top-0 p-6">
        <div className="pb-4 border-b border-gray-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary">
            Instructor Portal
          </h2>
        </div>
        <NavigationContent
          handleLogout={() => handleLogout(clearAuth, router)}
        />
      </aside>
    </>
  );
}
