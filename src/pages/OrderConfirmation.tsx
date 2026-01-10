import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { formatDate, formatCurrency } from '@/i18n/formatters';

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
  const { t } = useTranslation();
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError(t('orderConfirmation.orderNotFound'));
        setLoading(false);
        return;
      }

      // Get confirmation token from URL
      const token = searchParams.get('token');
      
      if (!token) {
        setError(t('orderConfirmation.invalidLink'));
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
          setError(t('orderConfirmation.accessDenied'));
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
        setError(t('orderConfirmation.orderNotFound'));
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, searchParams, t]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t('orderConfirmation.loadingOrder')}</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {error || t('orderConfirmation.orderNotFound')}
          </h1>
          <p className="text-muted-foreground mb-4">
            {t('orderConfirmation.checkEmail')}
          </p>
          <Button onClick={() => navigate('/marketplace')}>
            {t('orderConfirmation.backToMarketplace')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t('orderConfirmation.seo.title')}</title>
        <meta name="description" content={t('orderConfirmation.seo.description')} />
      </Helmet>

      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">{t('orderConfirmation.title')}</h1>
            <p className="text-muted-foreground">
              {t('orderConfirmation.subtitle')}
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">{t('orderConfirmation.orderDetails')}</h2>
              <p className="text-sm text-muted-foreground">
                {t('orderConfirmation.orderId', { id: order.id })}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('orderConfirmation.placedOn', { date: formatDate(order.created_at) })}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">{t('orderConfirmation.itemsOrdered')}</h3>
              <div className="space-y-3">
                {order.order_items.map((item, index) => (
                  <div key={index} className="flex justify-between border-b border-border pb-3">
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-muted-foreground">{item.farm_name}</p>
                      <p className="text-sm">
                        {item.quantity} {item.unit} × {formatCurrency(Number(item.unit_price))}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(Number(item.line_total))}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border flex justify-between text-lg font-bold">
                <span>{t('cart.total')}</span>
                <span>{formatCurrency(Number(order.total_amount))}</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">{t('orderConfirmation.deliveryInfo')}</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">{t('orderConfirmation.name')}</span> {order.customer_first_name}{' '}
                  {order.customer_last_name}
                </p>
                <p>
                  <span className="font-medium">{t('orderConfirmation.emailLabel')}</span> {order.customer_email}
                </p>
                <p className="mt-2">
                  <span className="font-medium">{t('orderConfirmation.deliveryAddress')}</span>
                </p>
                <p className="ml-4">
                  {order.delivery_street}
                  <br />
                  {order.delivery_postal_code} {order.delivery_city}
                  <br />
                  {order.delivery_country}
                </p>
                <p className="mt-2">
                  <span className="font-medium">{t('orderConfirmation.deliveryDate')}</span>{' '}
                  {formatDate(order.delivery_date)}
                </p>
                {order.delivery_time_slot && (
                  <p>
                    <span className="font-medium">{t('orderConfirmation.timeSlotLabel')}</span> {order.delivery_time_slot}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-muted p-4 rounded">
              <p className="text-sm">
                {t('orderConfirmation.confirmationEmail', { email: order.customer_email })}
              </p>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => navigate('/marketplace')} variant="outline" className="flex-1">
                {t('orderConfirmation.continueShopping')}
              </Button>
              <Button onClick={() => navigate('/')} className="flex-1">
                {t('orderConfirmation.backToHome')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
