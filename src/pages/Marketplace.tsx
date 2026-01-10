import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
import { CartDrawer } from "@/components/CartDrawer";
import { Link } from "react-router-dom";
import { ProducerForm } from "@/components/ProducerForm";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
}

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
  category_id: string;
  farms: {
    id: string;
    name: string;
    region: string;
  };
}

const Marketplace = () => {
  const { t } = useTranslation();
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("id, name")
      .order("name", { ascending: true });
    setCategories(data || []);
  };

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
        title: t('marketplace.errorLoading'),
        description: t('marketplace.errorDescription'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.farms.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || product.category_id === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{t('marketplace.seo.title')}</title>
        <meta name="description" content={t('marketplace.seo.description')} />
        <meta property="og:title" content={t('marketplace.seo.title')} />
        <meta property="og:description" content={t('marketplace.seo.description')} />
      </Helmet>
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60" role="banner">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            {t('common.biobridge')}
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/marketplace" className="text-foreground hover:text-primary transition-colors">
              {t('nav.marketplace')}
            </Link>
            <Link to="/#how-it-works" className="text-foreground hover:text-primary transition-colors">
              {t('nav.howItWorks')}
            </Link>
            <Link to="/#for-producers" className="text-foreground hover:text-primary transition-colors">
              {t('nav.forProducers')}
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <CartDrawer />
            <Button onClick={() => setFormOpen(true)}>{t('common.joinProducer')}</Button>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4">
        <nav className="text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            {t('common.home')}
          </Link>
          <span className="mx-2">›</span>
          <span className="text-foreground">{t('nav.marketplace')}</span>
        </nav>
      </div>

      {/* Hero Section (Compact) */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('marketplace.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('marketplace.subtitle')}
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
              placeholder={t('marketplace.searchPlaceholder')}
              className="flex-1 max-w-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder={t('marketplace.category')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('marketplace.allCategories')}</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
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
              <p className="text-muted-foreground">{t('marketplace.loadingProducts')}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery || selectedCategory !== "all" 
                  ? t('marketplace.noFilteredProducts')
                  : t('marketplace.noProducts')}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">
                  {t('marketplace.showingProducts', { count: filteredProducts.length })}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
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
              <h3 className="text-2xl font-bold mb-2">{t('common.biobridge')}</h3>
              <p className="text-primary-foreground/80">
                {t('home.footer.partnerStatement')}
              </p>
            </div>
            <div className="flex flex-wrap gap-6 text-primary-foreground/80">
              <Link to="#" className="hover:text-primary-foreground transition-colors">
                {t('common.about')}
              </Link>
              <Link to="#" className="hover:text-primary-foreground transition-colors">
                {t('common.faq')}
              </Link>
              <Link to="#" className="hover:text-primary-foreground transition-colors">
                {t('common.contact')}
              </Link>
              <Link to="#" className="hover:text-primary-foreground transition-colors">
                {t('common.terms')}
              </Link>
              <Link to="#" className="hover:text-primary-foreground transition-colors">
                {t('common.privacy')}
              </Link>
            </div>
          </div>
          <div className="pt-8 border-t border-primary-foreground/20 text-center text-primary-foreground/60">
            <p>{t('common.copyright', { year: new Date().getFullYear() })}</p>
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
