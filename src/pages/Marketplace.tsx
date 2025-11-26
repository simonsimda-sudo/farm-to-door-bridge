import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCard } from "@/components/ProductCard";
import { FarmProfileDialog } from "@/components/FarmProfileDialog";
import { Link } from "react-router-dom";
import { ProducerForm } from "@/components/ProducerForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  price: number;
  unit: string;
  certification: string;
  delivery_estimate: string;
  in_stock: boolean;
  farms: {
    id: string;
    name: string;
    region: string;
  };
}

const Marketplace = () => {
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          farms (
            id,
            name,
            region
          )
        `)
        .eq("in_stock", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error loading products",
        description: "Failed to load marketplace products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Organic Marketplace – Shop Fresh Produce | BioBridge</title>
        <meta name="description" content="Shop certified organic produce from local farms at BioBridge marketplace. Fresh vegetables, fruits, and sustainable products delivered from farm to table. Visit trybiobridge.com" />
        <meta property="og:title" content="Organic Marketplace – Shop Fresh Produce | BioBridge" />
        <meta property="og:description" content="Shop certified organic produce from local farms at BioBridge marketplace. Fresh vegetables, fruits, and sustainable products delivered from farm to table." />
      </Helmet>
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60" role="banner">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            BioBridge
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/marketplace" className="text-foreground hover:text-primary transition-colors">
              Marketplace
            </Link>
            <Link to="/#how-it-works" className="text-foreground hover:text-primary transition-colors">
              How it works
            </Link>
            <Link to="/#for-producers" className="text-foreground hover:text-primary transition-colors">
              For Producers
            </Link>
          </nav>
          <Button onClick={() => setFormOpen(true)}>Join as a Producer</Button>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4">
        <nav className="text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span className="mx-2">›</span>
          <span className="text-foreground">Marketplace</span>
        </nav>
      </div>

      {/* Hero Section (Compact) */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Fresh Organic Marketplace
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover hand-selected produce from certified farms at trybiobridge.com
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main>

      {/* Controls Bar */}
      <section className="py-6 border-b bg-card">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <Input
              type="search"
              placeholder="Search products or farms…"
              className="flex-1 max-w-md"
              disabled
            />
            <div className="flex flex-wrap gap-2">
              <Select disabled>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                </SelectContent>
              </Select>
              <Select disabled>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Farm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Farms</SelectItem>
                </SelectContent>
              </Select>
              <Select disabled>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Certification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Certifications</SelectItem>
                </SelectContent>
              </Select>
              <Select disabled>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                </SelectContent>
              </Select>
              <Select disabled>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low → High</SelectItem>
                  <SelectItem value="price-high">Price: High → Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No products available yet. Check back soon!
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing {products.length} product{products.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      id: product.id,
                      name: product.name,
                      description: product.description || "",
                      image: product.image_url || "/placeholder.svg",
                      price: `€${product.price.toFixed(2)}`,
                      unit: product.unit,
                      certification: product.certification,
                      farm: product.farms.name,
                      region: product.farms.region,
                      deliveryEstimate: product.delivery_estimate,
                      farmId: product.farms.id,
                    }}
                    onViewFarm={(farmId) => setSelectedFarmId(farmId)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div className="text-primary-foreground">
              <h3 className="text-2xl font-bold mb-2">BioBridge</h3>
              <p className="text-primary-foreground/80">
                BioBridge partners only with certified-organic producers.
              </p>
            </div>
            <div className="flex flex-wrap gap-6 text-primary-foreground/80">
              <Link to="#" className="hover:text-primary-foreground transition-colors">
                About
              </Link>
              <Link to="#" className="hover:text-primary-foreground transition-colors">
                FAQ
              </Link>
              <Link to="#" className="hover:text-primary-foreground transition-colors">
                Contact
              </Link>
              <Link to="#" className="hover:text-primary-foreground transition-colors">
                Terms
              </Link>
              <Link to="#" className="hover:text-primary-foreground transition-colors">
                Privacy
              </Link>
            </div>
          </div>
          <div className="pt-8 border-t border-primary-foreground/20 text-center text-primary-foreground/60">
            <p>© 2024 BioBridge. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <FarmProfileDialog
        farmId={selectedFarmId}
        open={selectedFarmId !== null}
        onOpenChange={(open) => !open && setSelectedFarmId(null)}
      />

      <ProducerForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
};

export default Marketplace;
