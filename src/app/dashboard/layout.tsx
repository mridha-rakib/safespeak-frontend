// import { RequireUserAuth } from "@/components/auth/require-user-auth";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Temporarily bypass RequireUserAuth for local debugging
  return <>{children}</>;
}
