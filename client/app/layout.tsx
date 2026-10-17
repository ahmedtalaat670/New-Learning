import type { Metadata } from "next";
import { Be_Vietnam_Pro, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { GoogleProvider } from "@/components/GoogleProvider";
import { AuthInitializer } from "@/components/AuthInitializer";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

type LayoutProps = {
  children: React.ReactNode;
};

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4000",
  ),

  title: {
    default: "SkillBridge | Unlock Your Creative Potential",
    template: "%s | SkillBridge",
  },

  description:
    "Develop in-demand skills with SkillBridge. Explore expert-led courses, learn at your own pace, and build your future with practical, high-quality education.",

  applicationName: "SkillBridge",

  keywords: [
    "SkillBridge",
    "online learning",
    "online courses",
    "programming courses",
    "web development",
    "frontend development",
    "backend development",
    "software engineering",
    "e-learning",
  ],

  authors: [{ name: "SkillBridge" }],

  creator: "SkillBridge",

  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "SkillBridge",
    title: "SkillBridge | Unlock Your Creative Potential",
    description:
      "Learn new skills, explore expert-led courses, and take the next step in your professional journey with SkillBridge.",
    url: "/",
    images: [
      {
        url: "/website-image.png",
        width: 1200,
        height: 630,
        alt: "SkillBridge — Unlock Your Creative Potential",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "SkillBridge | Unlock Your Creative Potential",
    description:
      "Explore expert-led courses and build your future with SkillBridge.",
    images: ["/images/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: [{ url: "/favicon-new.ico", type: "image/x-icon" }],
  },
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        beVietnamPro.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body className="min-h-full flex flex-col bg-gray-100">
        <AuthInitializer />
        <GoogleProvider>{children}</GoogleProvider>
      </body>
    </html>
  );
}
