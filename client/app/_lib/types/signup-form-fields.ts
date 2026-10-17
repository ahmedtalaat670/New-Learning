import { SignUpValues } from "../schemas/sign-up.schema";

export interface SignUpField {
  name: keyof SignUpValues;
  label: string;
  type: "text" | "email" | "password";
  autoComplete: string;
  placeholder: string;
  hint?: string;
}
