import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { FarmManagement } from "@/components/admin/FarmManagement";
import { ProductManagement } from "@/components/admin/ProductManagement";
import { CategoryManagement } from "@/components/admin/CategoryManagement";
import UserManagement from "@/components/admin/UserManagement";
import { OrderManagement } from "@/components/admin/OrderManagement";
import { SubmissionsManagement } from "@/components/admin/SubmissionsManagement";
import { LogOut } from "lucide-react";

export default function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    // Check if user has admin role using the security definer function
    // This bypasses RLS and avoids the chicken-and-egg problem
    const { data: hasAdminRole, error } = await supabase
      .rpc('has_role', { 
        _user_id: session.user.id, 
        _role: 'admin' 
      });

    if (error) {
      console.error('Error checking admin role:', error);
      toast.error("Error checking permissions. Please try again.");
      navigate("/");
      return;
    }

    if (!hasAdminRole) {
      toast.error("Access denied. Admin role required.");
      navigate("/");
      return;
    }

    setIsAdmin(true);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">BioBridge Admin</h1>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="farms">Farms</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6">
            <OrderManagement />
          </TabsContent>

          <TabsContent value="submissions" className="mt-6">
            <SubmissionsManagement />
          </TabsContent>

          <TabsContent value="farms" className="mt-6">
            <FarmManagement />
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <CategoryManagement />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}