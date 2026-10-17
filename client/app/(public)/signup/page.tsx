import { Metadata } from "next";
import SignUpForm from "./_components/SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create your free SkillBridge account today. Start learning from top-rated instructors or publish your own courses.",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Create an Account | SkillBridge",
    description:
      "Join SkillBridge today to learn new skills or share your expertise with students worldwide.",
    type: "website",
  },
};

export default function SignUpPage() {
  return (
    <div>
      <SignUpForm />
    </div>
  );
}
