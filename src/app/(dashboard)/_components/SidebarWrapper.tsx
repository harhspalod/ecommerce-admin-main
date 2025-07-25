import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/shared/AppSidebar";
import Header from "@/components/shared/header";
import Container from "@/components/ui/container";

type Props = {
  children: React.ReactNode;
  defaultOpen: boolean;
};

export default function SidebarWrapper({ children, defaultOpen }: Props) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />

      <div className="w-full relative overflow-y-auto">
        <Header />

        <main className="pt-6 pb-8">
          <Container>{children}</Container>
        </main>
      </div>
    </SidebarProvider>
  );
}