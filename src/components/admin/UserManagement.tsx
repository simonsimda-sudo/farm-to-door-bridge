import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/sanitized-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, UserPlus, UserMinus } from "lucide-react";
import { formatBackendError, isAbortLikeError } from "@/lib/error-utils";

interface User {
  id: string;
  email: string;
  created_at: string;
  roles: string[];
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('get-users');
      
      if (error) throw error;
      
      setUsers(data.users || []);
    } catch (error: any) {
      if (isAbortLikeError(error)) return;
      console.error('Error fetching users:', error);
      toast.error(`Failed to load users: ${formatBackendError(error)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddAdmin = async (userId: string) => {
    try {
      setProcessingUserId(userId);
      
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: 'admin' });

      if (error) throw error;

      toast.success('Admin role granted successfully');
      await fetchUsers();
    } catch (error: any) {
      console.error('Error adding admin role:', error);
      toast.error('Failed to grant admin role');
    } finally {
      setProcessingUserId(null);
    }
  };

  const handleRemoveAdmin = async (userId: string) => {
    try {
      setProcessingUserId(userId);
      
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', 'admin');

      if (error) throw error;

      toast.success('Admin role removed successfully');
      await fetchUsers();
    } catch (error: any) {
      console.error('Error removing admin role:', error);
      toast.error('Failed to remove admin role');
    } finally {
      setProcessingUserId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No users found</p>
            ) : (
              users.map((user) => {
                const isAdmin = user.roles.includes('admin');
                const isProcessing = processingUserId === user.id;

                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{user.email}</p>
                      <p className="text-sm text-muted-foreground">
                        Joined: {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {isAdmin && (
                        <Badge variant="default">Admin</Badge>
                      )}
                      
                      {isAdmin ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveAdmin(user.id)}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <UserMinus className="h-4 w-4 mr-2" />
                              Remove Admin
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleAddAdmin(user.id)}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Make Admin
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}