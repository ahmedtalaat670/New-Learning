import Link from "next/link";

import NavLinks from "./NavLinks";
import MobileNav from "./MobileNav";
import { AuthActions } from "./AuthActions";
import { useAuthStore } from "@/app/_stores/auth";
export default function Header() {
  const accessToken = useAuthStore.getState().accessToken as string;
  console.log(accessToken, "accessToken");
  return (
    <header className="w-full">
      {/* Top Banner */}
      <div className="flex min-h-10 items-center justify-center bg-primary px-4 py-2 text-center text-base font-medium text-white sm:text-xl">
        <p>
          Free Courses 🌟 Sale Ends Soon,{" "}
          <Link
            href="/courses"
            className="font-semibold underline underline-offset-2 transition-all hover:no-underline"
          >
            Get It Now
          </Link>
        </p>
      </div>

      {/* Navbar */}
      <nav>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
          {/* Logo + Desktop Navigation */}
          <div className="flex items-center gap-8 xl:gap-10">
            <Link
              href="/"
              className="text-xl font-bold text-primary transition-transform duration-200 hover:scale-105 sm:text-2xl"
            >
              LMS
            </Link>

            <NavLinks />
          </div>

          {/* Desktop Authentication */}
          <div className="hidden lg:flex">
            <AuthActions />
          </div>

          {/* Mobile / Tablet */}
          <div className="lg:hidden">
            <MobileNav />
          </div>
        </div>
      </nav>
    </header>
  );
}
