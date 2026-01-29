import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/sanitized-client';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { formatBackendError, isAbortLikeError } from "@/lib/error-utils";

type OrderStatus = 'new' | 'confirmed' | 'in_delivery' | 'delivered' | 'cancelled';

interface Order {
  id: string;
  created_at: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_street: string;
  delivery_city: string;
  delivery_postal_code: string;
  delivery_country: string;
  delivery_notes: string | null;
  delivery_date: string;
  delivery_time_slot: string | null;
  order_status: OrderStatus;
  total_amount: number;
}

interface OrderItem {
  product_name: string;
  farm_name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  line_total: number;
}

export const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      if (isAbortLikeError(error)) return;
      console.error('Error fetching orders:', error);
      toast({
        title: 'Error loading orders',
        description: `Failed to load orders: ${formatBackendError(error)}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderItems = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (error) throw error;
      setOrderItems(data || []);
    } catch (error) {
      console.error('Error fetching order items:', error);
    }
  };

  const handleOrderClick = async (order: Order) => {
    setSelectedOrder(order);
    await fetchOrderItems(order.id);
    setDialogOpen(true);
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ order_status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, order_status: newStatus } : order
        )
      );

      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, order_status: newStatus } : null);
      }

      toast({
        title: 'Status updated',
        description: 'Order status has been updated successfully',
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: 'Error updating status',
        description: 'Failed to update order status',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return 'text-blue-600';
      case 'confirmed':
        return 'text-green-600';
      case 'in_delivery':
        return 'text-yellow-600';
      case 'delivered':
        return 'text-gray-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return '';
    }
  };

  const handleDeleteClick = (order: Order) => {
    setOrderToDelete(order);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!orderToDelete) return;

    try {
      // First delete order items
      const { error: itemsError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', orderToDelete.id);

      if (itemsError) throw itemsError;

      // Then delete the order
      const { error: orderError } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderToDelete.id);

      if (orderError) throw orderError;

      setOrders(prev => prev.filter(o => o.id !== orderToDelete.id));
      toast({
        title: 'Order deleted',
        description: 'The order has been deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({
        title: 'Error deleting order',
        description: 'Failed to delete the order',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setOrderToDelete(null);
    }
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Orders</h2>
        <p className="text-muted-foreground">{orders.length} total orders</p>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Delivery Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">
                  {order.id.slice(0, 8)}...
                </TableCell>
                <TableCell>{format(new Date(order.created_at), 'PPP')}</TableCell>
                <TableCell>
                  {order.customer_first_name} {order.customer_last_name}
                </TableCell>
                <TableCell>{format(new Date(order.delivery_date), 'PPP')}</TableCell>
                <TableCell>€{Number(order.total_amount).toFixed(2)}</TableCell>
                <TableCell>
                  <span className={`font-medium ${getStatusColor(order.order_status)}`}>
                    {order.order_status}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleOrderClick(order)}>
                    View Details
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteClick(order)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Order Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p>
                    <span className="text-muted-foreground">Order ID:</span> {selectedOrder.id}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Created:</span>{' '}
                    {format(new Date(selectedOrder.created_at), 'PPP p')}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Total:</span> €
                    {Number(selectedOrder.total_amount).toFixed(2)}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Customer Details</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    {selectedOrder.customer_first_name} {selectedOrder.customer_last_name}
                  </p>
                  <p>{selectedOrder.customer_email}</p>
                  <p>{selectedOrder.customer_phone}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Delivery Information</h3>
                <div className="space-y-1 text-sm">
                  <p>{selectedOrder.delivery_street}</p>
                  <p>
                    {selectedOrder.delivery_postal_code} {selectedOrder.delivery_city}
                  </p>
                  <p>{selectedOrder.delivery_country}</p>
                  <p className="mt-2">
                    <span className="text-muted-foreground">Delivery Date:</span>{' '}
                    {format(new Date(selectedOrder.delivery_date), 'PPP')}
                  </p>
                  {selectedOrder.delivery_time_slot && (
                    <p>
                      <span className="text-muted-foreground">Time Slot:</span>{' '}
                      {selectedOrder.delivery_time_slot}
                    </p>
                  )}
                  {selectedOrder.delivery_notes && (
                    <p className="mt-2">
                      <span className="text-muted-foreground">Notes:</span>{' '}
                      {selectedOrder.delivery_notes}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Order Items</h3>
                <div className="space-y-2">
                  {orderItems.map((item, index) => (
                    <div key={index} className="flex justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-muted-foreground">{item.farm_name}</p>
                        <p className="text-sm">
                          {item.quantity} {item.unit} × €{Number(item.unit_price).toFixed(2)}
                        </p>
                      </div>
                      <p className="font-semibold">€{Number(item.line_total).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Update Status</h3>
                <Select
                  value={selectedOrder.order_status}
                  onValueChange={value => updateOrderStatus(selectedOrder.id, value as OrderStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="in_delivery">In Delivery</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this order? This action cannot be undone.
              {orderToDelete && (
                <span className="block mt-2 font-medium">
                  Order from {orderToDelete.customer_first_name} {orderToDelete.customer_last_name} - €{Number(orderToDelete.total_amount).toFixed(2)}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
