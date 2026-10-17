import Link from "next/link";
import {
  SiFacebook,
  SiInstagram,
  SiGithub,
  SiX,
} from "@icons-pack/react-simple-icons";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: SiFacebook,
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: SiInstagram,
  },
  {
    label: "GitHub",
    href: "https://github.com",
    icon: SiGithub,
  },
  {
    label: "X",
    href: "https://x.com",
    icon: SiX,
  },
];

export default function Footer() {
  return (
    <footer className="border-t bg-white mt-10">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-primary transition-transform duration-200 hover:scale-105"
          >
            LMS
          </Link>

          {/* Routes */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social Media */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;

              return (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-white hover:shadow-md"
                >
                  <Icon size={18} />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} LMS. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
