import { useState } from "react";
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

// Placeholder product data structure - ready for real data injection
const placeholderProducts = Array.from({ length: 12 }, (_, i) => ({
  id: `product-${i + 1}`,
  name: "Product Name",
  description: "Seasonal, field-picked quality. Limited availability.",
  image: "/placeholder.svg",
  price: "€—",
  unit: "unit",
  certification: "Certified Organic",
  farm: "Farm Name",
  region: "Region",
  deliveryEstimate: "Est. harvest → delivery",
  farmId: `farm-${i + 1}`,
}));

const Marketplace = () => {
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
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
            Discover hand-selected produce from certified farms.
          </p>
        </div>
      </section>

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
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Showing 12 of &#123;&#123;Total&#125;&#125;
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {placeholderProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewFarm={(farmId) => setSelectedFarmId(farmId)}
              />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button size="lg" variant="outline" disabled>
              Load More
            </Button>
          </div>
        </div>
      </section>

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
