"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { navLinks } from "./NavLinks";
import { Button } from "./ui/button";
import { AuthActions } from "./AuthActions";

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger>
        <div className="lg:hidden">
          <Menu className="h-6 w-6" />
        </div>
      </SheetTrigger>

      <SheetContent side="right" className="w-75 sm:w-87.5">
        <SheetHeader>
          <SheetTitle className="text-left text-xl font-bold text-primary">
            LMS
          </SheetTitle>
        </SheetHeader>

        <nav className="mt-8 flex flex-col">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href ||
                  pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`border-b pl-3 py-4 text-base font-medium transition-colors ${
                  isActive
                    ? "border-primary text-primary pl-5"
                    : "text-gray-700 hover:text-primary hover:pl-5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8">
          <AuthActions />
        </div>
      </SheetContent>
    </Sheet>
  );
}
