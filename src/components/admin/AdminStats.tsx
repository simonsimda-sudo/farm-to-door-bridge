import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, ShoppingCart, FileText, Leaf } from "lucide-react";
import { formatBackendError, isAbortLikeError } from "@/lib/error-utils";

interface Stats {
  totalOrders: number;
  newSubmissions: number;
  productCount: number;
  farmCount: number;
}

export function AdminStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [ordersRes, submissionsRes, productsRes, farmsRes] = await Promise.all([
        // Avoid HEAD requests (can be blocked/aborted by some clients/proxies).
        // We only need counts; limit to 1 row to keep payload tiny.
        supabase.from("orders").select("id", { count: "exact" }).limit(1),
        supabase
          .from("producer_submissions")
          .select("id", { count: "exact" })
          .eq("status", "new")
          .limit(1),
        supabase.from("products").select("id", { count: "exact" }).limit(1),
        supabase.from("farms").select("id", { count: "exact" }).limit(1),
      ]);

      if (ordersRes.error || submissionsRes.error || productsRes.error || farmsRes.error) {
        console.error("Failed to fetch admin stats", {
          orders: ordersRes.error,
          submissions: submissionsRes.error,
          products: productsRes.error,
          farms: farmsRes.error,
        });
      }

      setStats({
        totalOrders: ordersRes.count ?? 0,
        newSubmissions: submissionsRes.count ?? 0,
        productCount: productsRes.count ?? 0,
        farmCount: farmsRes.count ?? 0,
      });
    } catch (error) {
      if (isAbortLikeError(error)) return;
      console.error("Failed to fetch stats:", formatBackendError(error));
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: "Total Orders",
      value: stats?.totalOrders ?? 0,
      icon: ShoppingCart,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      label: "New Submissions",
      value: stats?.newSubmissions ?? 0,
      icon: FileText,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      label: "Products",
      value: stats?.productCount ?? 0,
      icon: Package,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      label: "Farms",
      value: stats?.farmCount ?? 0,
      icon: Leaf,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat) => (
        <Card key={stat.label} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
