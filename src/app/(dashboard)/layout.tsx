import SidebarWrapper from "./_components/SidebarWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SidebarWrapper>{children}</SidebarWrapper>;
}