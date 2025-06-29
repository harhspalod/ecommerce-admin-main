import { MdOutlineDashboard } from "react-icons/md";
import { LuUsers2 } from "react-icons/lu";
import { RiCoupon2Line } from "react-icons/ri";
import { MdOutlineShoppingCart } from "react-icons/md";
import { MessageCircle, Share2 } from "lucide-react";

export const navItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: <MdOutlineDashboard />,
  },
  {
    title: "Products",
    url: "/products",
    icon: <MdOutlineShoppingCart />,
  },
  {
    title: "Customers",
    url: "/customers",
    icon: <LuUsers2 />,
  },
  {
    title: "Coupons",
    url: "/coupons",
    icon: <RiCoupon2Line />,
  },
  {
    title: "AI Chat",
    url: "/chat",
    icon: <MessageCircle />,
  },
  {
    title: "Social Media",
    url: "/social",
    icon: <Share2 />,
  },
];