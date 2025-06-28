import { cookies } from "next/headers";
import SidebarWrapper from "./_components/SidebarWrapper";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return <SidebarWrapper defaultOpen={defaultOpen}>{children}</SidebarWrapper>;
}