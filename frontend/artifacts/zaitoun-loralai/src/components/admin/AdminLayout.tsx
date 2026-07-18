import { useLocation } from "wouter";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarInset,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { LayoutDashboard, Package, ShoppingCart, MessageSquare, LogOut, Bell } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { adminApi } from "@/lib/api";
import { toast } from "sonner";
import { useEffect, useState } from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAdminAuth();

  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    adminApi.getStats().then((data) => {
      setLowStockCount(data.low_stock_products?.length ?? 0);
    }).catch(() => {});
    return () => controller.abort();
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    setLocation("/admin/login");
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground text-sm font-bold">
              ZL
            </div>
            <span className="text-sm font-semibold truncate group-data-[collapsible=icon]:hidden">
              Zaitoun Loralai
            </span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location === "/admin/dashboard"}>
                  <a href="/admin/dashboard">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location === "/admin/products"}>
                  <a href="/admin/products">
                    <Package className="h-4 w-4" />
                    <span>Products</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location === "/admin/reviews"}>
                  <a href="/admin/reviews">
                    <MessageSquare className="h-4 w-4" />
                    <span>Reviews</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location === "/admin/orders"}>
                  <a href="/admin/orders">
                    <ShoppingCart className="h-4 w-4" />
                    <span>Orders</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 sticky top-0 z-10">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          <div className="flex-1" />
          <button
            onClick={() => setLocation("/admin/dashboard")}
            className="relative mr-2"
            title="Low stock alerts"
          >
            <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
            {lowStockCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-red-600 text-white text-[10px] font-bold leading-none">
                {lowStockCount}
              </span>
            )}
          </button>
          {user && (
            <span className="text-sm text-muted-foreground">
              {user.username}
            </span>
          )}
        </header>
        <div className="flex-1 bg-muted/30">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
