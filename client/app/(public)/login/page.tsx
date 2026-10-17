import { Metadata } from "next";
import LogInForm from "./_components/LogInForm";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Log in to your SkillBridge account to access your courses, track your learning progress, or manage your instructor dashboard.",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Log In | SkillBridge",
    description:
      "Sign in to access your courses and continue learning on SkillBridge.",
    type: "website",
  },
};

export default function SignInPage() {
  return (
    <div>
      <LogInForm />
    </div>
  );
}
