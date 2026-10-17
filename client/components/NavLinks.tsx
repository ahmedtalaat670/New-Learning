"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const navLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Courses",
    href: "/courses",
  },
  {
    label: "About Us",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
      {navLinks.map((link) => {
        const isActive =
          link.href === "/"
            ? pathname === "/"
            : pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`relative py-2 text-sm font-medium transition-colors duration-200 ${
              isActive ? "text-primary" : "text-gray-700 hover:text-primary"
            }`}
          >
            {link.label}

            <span
              className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
                isActive ? "w-full" : "w-0"
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
}
