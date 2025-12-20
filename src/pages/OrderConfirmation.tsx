import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('No order ID provided');
        setLoading(false);
        return;
      }

      // Get confirmation token from URL
      const token = searchParams.get('token');
      
      if (!token) {
        setError('Invalid order access link');
        setLoading(false);
        return;
      }

      try {
        // Fetch order using secure RPC function that validates both order_id AND confirmation_token
        const { data: orderData, error: orderError } = await supabase
          .rpc('get_order_by_token', {
            _order_id: orderId,
            _confirmation_token: token
          });

        if (orderError || !orderData || orderData.length === 0) {
          setError('Order not found or access denied');
          setLoading(false);
          return;
        }

        // Fetch order items using secure RPC function
        const { data: itemsData, error: itemsError } = await supabase
          .rpc('get_order_items_by_token', {
            _order_id: orderId,
            _confirmation_token: token
          });

        if (itemsError) throw itemsError;

        setOrder({
          ...orderData[0],
          order_items: itemsData || [],
        });
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {error || 'Order not found'}
          </h1>
          <p className="text-muted-foreground mb-4">
            Please check your order confirmation email for the correct link.
          </p>
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
