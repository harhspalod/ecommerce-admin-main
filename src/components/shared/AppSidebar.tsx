"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { BsFillHandbagFill } from "react-icons/bs";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { navItems } from "@/constants/navItems";
import Typography from "@/components/ui/typography";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";

export default function AppSidebar() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleLogout = () => {
    toast.success("Logged out successfully!");
    // In a real app, you would handle logout logic here
  };

  return (
    <Sidebar className="shadow-md">
      <SidebarContent className="relative">
        <div className="pb-20 h-full">
          <div className="py-6 px-2 flex flex-col overflow-y-auto h-full">
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "font-bold text-2xl px-6 gap-2 justify-start min-h-fit hover:bg-transparent"
              )}
            >
              <BsFillHandbagFill className="size-6 text-primary mb-1.5 flex-shrink-0" />
              <Typography component="span">Zorvex</Typography>
            </Link>

            <ul className="pt-6 flex flex-col gap-y-2">
              {navItems.map((navItem, index) => (
                <li key={`nav-item-${index}`}>
                  <Link
                    onClick={isMobile ? () => setOpenMobile(false) : undefined}
                    href={navItem.url}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "relative w-full justify-start px-5 py-4 gap-x-2.5 [&_svg]:size-6 [&_svg]:flex-shrink-0 font-medium text-base focus-visible:bg-accent focus-visible:text-accent-foreground",
                      pathname === navItem.url &&
                        "bg-accent text-accent-foreground after:content-[''] after:absolute after:top-0 after:left-0 after:h-full after:w-1 after:bg-primary after:rounded-r-lg"
                    )}
                  >
                    {navItem.icon} {navItem.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="px-6 py-4 absolute left-0 w-full right-0 bottom-0 border-t">
            <Button
              onClick={handleLogout}
              className="w-full py-3 text-base whitespace-nowrap"
            >
              <LogOut className="size-6 mr-3 flex-shrink-0" />
              Log out
            </Button>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}