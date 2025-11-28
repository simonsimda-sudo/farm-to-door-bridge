import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface OrderDetails {
  id: string;
  created_at: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  delivery_street: string;
  delivery_city: string;
  delivery_postal_code: string;
  delivery_country: string;
  delivery_date: string;
  delivery_time_slot: string | null;
  total_amount: number;
  order_items: {
    product_name: string;
    farm_name: string;
    quantity: number;
    unit: string;
    unit_price: number;
    line_total: number;
  }[];
}

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      try {
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (orderError) throw orderError;

        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', orderId);

        if (itemsError) throw itemsError;

        setOrder({
          ...orderData,
          order_items: itemsData,
        });
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order not found</h1>
          <Button onClick={() => navigate('/marketplace')}>
            Back to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Order Confirmation – BioBridge</title>
        <meta name="description" content="Your order has been placed successfully" />
      </Helmet>

      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Thank You for Your Order!</h1>
            <p className="text-muted-foreground">
              Your order has been placed successfully
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Order Details</h2>
              <p className="text-sm text-muted-foreground">Order ID: {order.id}</p>
              <p className="text-sm text-muted-foreground">
                Placed on: {format(new Date(order.created_at), 'PPP')}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Items Ordered</h3>
              <div className="space-y-3">
                {order.order_items.map((item, index) => (
                  <div key={index} className="flex justify-between border-b border-border pb-3">
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-muted-foreground">{item.farm_name}</p>
                      <p className="text-sm">
                        {item.quantity} {item.unit} × €{Number(item.unit_price).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">€{Number(item.line_total).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>€{Number(order.total_amount).toFixed(2)}</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Delivery Information</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Name:</span> {order.customer_first_name}{' '}
                  {order.customer_last_name}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {order.customer_email}
                </p>
                <p className="mt-2">
                  <span className="font-medium">Delivery Address:</span>
                </p>
                <p className="ml-4">
                  {order.delivery_street}
                  <br />
                  {order.delivery_postal_code} {order.delivery_city}
                  <br />
                  {order.delivery_country}
                </p>
                <p className="mt-2">
                  <span className="font-medium">Delivery Date:</span>{' '}
                  {format(new Date(order.delivery_date), 'PPP')}
                </p>
                {order.delivery_time_slot && (
                  <p>
                    <span className="font-medium">Time Slot:</span> {order.delivery_time_slot}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-muted p-4 rounded">
              <p className="text-sm">
                You will receive a confirmation email at{' '}
                <span className="font-medium">{order.customer_email}</span> with your order
                details and tracking information.
              </p>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => navigate('/marketplace')} variant="outline" className="flex-1">
                Continue Shopping
              </Button>
              <Button onClick={() => navigate('/')} className="flex-1">
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
