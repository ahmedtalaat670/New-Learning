import { GoogleOAuthProvider } from "@react-oauth/google";

interface GoogleProviderProps {
  children: React.ReactNode;
}

export function GoogleProvider({ children }: GoogleProviderProps) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    throw new Error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured");
  }
  return (
    <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
  );
}
