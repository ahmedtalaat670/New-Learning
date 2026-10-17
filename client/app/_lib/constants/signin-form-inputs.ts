import type { SignInValues } from "../schemas/sign-in.schema";

type SignInFormInput = {
  name: keyof SignInValues;
  label: string;
  type: "email" | "password";
  autoComplete: string;
  placeholder: string;
  hint?: string;
};

export const signInFormInputs: SignInFormInput[] = [
  {
    name: "email",
    label: "Email",
    type: "email",
    autoComplete: "email",
    placeholder: "you@example.com",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    autoComplete: "current-password",
    placeholder: "Enter your password",
  },
];
