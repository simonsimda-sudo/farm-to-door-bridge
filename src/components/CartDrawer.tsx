import { ShoppingCart, Plus, Minus, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/i18n/formatters';

export const CartDrawer = () => {
  const { t } = useTranslation();
  const { items, updateQuantity, removeItem, totalItems, subtotal, deliveryFee, total, freeDeliveryThreshold } = useCart();
  const navigate = useNavigate();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle>{t('cart.title')}</SheetTitle>
        </SheetHeader>
        
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground mt-8">
            <ShoppingCart className="h-16 w-16 mb-4 opacity-20" />
            <p>{t('cart.empty')}</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto mt-8 pr-2 space-y-4 min-h-0">
              {items.map(item => (
                <div key={item.productId} className="flex gap-4 border-b border-border pb-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">{item.farm}</p>
                    <p className="text-sm font-semibold mt-1">
                      {formatCurrency(item.price)}/{item.unit}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 ml-auto"
                        onClick={() => removeItem(item.productId)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-border pt-4 mt-4 space-y-3 bg-background">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t('cart.subtotal')}</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{t('cart.deliveryFee')}</span>
                  <span className={deliveryFee === 0 ? 'text-green-600 font-medium' : ''}>
                    {deliveryFee === 0 ? t('cart.free') : formatCurrency(deliveryFee)}
                  </span>
                </div>
                {deliveryFee > 0 && subtotal < freeDeliveryThreshold && (
                  <p className="text-xs text-muted-foreground">
                    {t('cart.addMoreForFree', { amount: (freeDeliveryThreshold - subtotal).toFixed(2) })}
                  </p>
                )}
                <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
                  <span>{t('cart.total')}</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={() => navigate('/checkout')}
              >
                {t('cart.proceedToCheckout')}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
