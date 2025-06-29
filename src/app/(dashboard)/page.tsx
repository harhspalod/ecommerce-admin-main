"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import PageTitle from "@/components/shared/PageTitle";
import { ShoppingCart, Users, Tag, MessageCircle } from "lucide-react";

interface DashboardStats {
  totalProducts: number;
  totalCustomers: number;
  totalCoupons: number;
  totalMessages: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCustomers: 0,
    totalCoupons: 0,
    totalMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [productsRes, customersRes, couponsRes, messagesRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/customers"),
        fetch("/api/coupons"),
        fetch("/api/chat"),
      ]);

      const [products, customers, coupons, messages] = await Promise.all([
        productsRes.json(),
        customersRes.json(),
        couponsRes.json(),
        messagesRes.json(),
      ]);

      setStats({
        totalProducts: products.success ? products.data.length : 0,
        totalCustomers: customers.success ? customers.data.length : 0,
        totalCoupons: coupons.success ? coupons.data.length : 0,
        totalMessages: messages.success ? messages.data.length : 0,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: ShoppingCart,
      color: "bg-blue-500",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Active Coupons",
      value: stats.totalCoupons,
      icon: Tag,
      color: "bg-purple-500",
    },
    {
      title: "Chat Messages",
      value: stats.totalMessages,
      icon: MessageCircle,
      color: "bg-orange-500",
    },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <section>
      <PageTitle>Dashboard Overview</PageTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <Card key={card.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </p>
                <p className="text-3xl font-bold">{card.value}</p>
              </div>
              <div className={`p-3 rounded-full ${card.color}`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a
              href="/products"
              className="block p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <div className="flex items-center space-x-3">
                <ShoppingCart className="h-5 w-5 text-blue-500" />
                <span>Manage Products</span>
              </div>
            </a>
            <a
              href="/customers"
              className="block p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-green-500" />
                <span>Manage Customers</span>
              </div>
            </a>
            <a
              href="/coupons"
              className="block p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Tag className="h-5 w-5 text-purple-500" />
                <span>Create Coupons</span>
              </div>
            </a>
            <a
              href="/chat"
              className="block p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-5 w-5 text-orange-500" />
                <span>AI Assistant</span>
              </div>
            </a>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b">
              <span>System initialized</span>
              <span className="text-muted-foreground">Just now</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span>Database connected</span>
              <span className="text-muted-foreground">Just now</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Ready to manage your store</span>
              <span className="text-muted-foreground">Now</span>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}