import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ShieldCheck, MapPin, TruckIcon } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
        <div className="text-2xl font-bold text-foreground">
          {product.price}
          <span className="text-sm font-normal text-muted-foreground">
            {" "}
            / {product.unit}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full">
                <Button className="w-full" disabled>
                  Add to Basket
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Coming soon</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => onViewFarm(product.farmId)}
        >
          See the Farm
        </Button>
      </CardFooter>
    </Card>
  );
};
