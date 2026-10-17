import { SignUpField } from "../types/signup-form-fields";

export const signUpFormInputs: SignUpField[] = [
  {
    name: "name",
    label: "Name",
    type: "text",
    autoComplete: "name",
    placeholder: "Your name",
  },
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
    autoComplete: "new-password",
    placeholder: "Create a password",
    hint: "At least 8 characters, including uppercase, lowercase, number, and special character.",
  },
] as const;
