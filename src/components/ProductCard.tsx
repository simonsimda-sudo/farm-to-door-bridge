import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldCheck, MapPin, TruckIcon, Plus, Minus, ShoppingCart } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  unit: string;
  certification: string;
  farm: string;
  region: string;
  deliveryEstimate: string;
  farmId: string;
}

interface ProductCardProps {
  product: Product;
  onViewFarm: (farmId: string) => void;
}

export const ProductCard = ({ product, onViewFarm }: ProductCardProps) => {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const priceNumber = parseFloat(product.price.replace('€', ''));

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      farm: product.farm,
      price: priceNumber,
      unit: product.unit,
      quantity,
      image: product.image,
    });
    toast({
      title: t('product.addedToCart'),
      description: t('product.addedDescription', { 
        quantity, 
        unit: product.unit, 
        name: product.name 
      }),
    });
    setQuantity(1);
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <AspectRatio ratio={4 / 3}>
          <img
            src={product.image}
            alt={`${product.name} - ${product.certification} from ${product.farm} in ${product.region}`}
            className="object-cover w-full h-full bg-muted"
          />
        </AspectRatio>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
        <CardDescription className="text-sm mb-4 line-clamp-2">
          {product.description}
        </CardDescription>

        {/* Meta Information */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-fresh-green" />
            <span>{product.certification}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-harvest-orange" />
            <span>
              {product.farm} • {product.region}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TruckIcon className="w-4 h-4 text-organic-green" />
            <span>{product.deliveryEstimate}</span>
          </div>
        </div>

        {/* Price */}
        <div className="text-2xl font-bold text-foreground mb-4">
          {product.price}
          <span className="text-sm font-normal text-muted-foreground">
            {" "}
            / {product.unit}
          </span>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center border border-border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="px-3 font-medium min-w-[3ch] text-center">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button className="flex-1" onClick={handleAddToCart}>
            <ShoppingCart className="h-4 w-4" />
            {t('product.addToCart')}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => onViewFarm(product.farmId)}
        >
          {t('product.seeTheFarm')}
        </Button>
      </CardFooter>
    </Card>
  );
};
