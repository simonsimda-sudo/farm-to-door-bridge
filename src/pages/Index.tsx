import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProducerForm } from "@/components/ProducerForm";
import { Leaf, TruckIcon, Users, CheckCircle2, Sprout, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-organic-produce.jpg";
import farmImage from "@/assets/farm-landscape.jpg";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
const Index = () => {
  const [formOpen, setFormOpen] = useState(false);
  const howItWorks = useScrollAnimation();
  const whyBioBridge = useScrollAnimation();
  const forProducers = useScrollAnimation();
  const ourDifference = useScrollAnimation();
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({
      behavior: "smooth"
    });
  };
  return <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-cover bg-center" style={{
      backgroundImage: `url(${heroImage})`
    }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">BioBridge</h1>
          <p className="text-2xl md:text-3xl text-white mb-4 drop-shadow-lg">
            From Certified Organic Farms to Your Door
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-45">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link to="/marketplace">Shop Fresh Products</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/90 hover:bg-white border-2" onClick={() => setFormOpen(true)}>
              Join as a Producer
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" ref={howItWorks.ref} className={`py-24 bg-card transition-all duration-1000 ${howItWorks.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-foreground">How It Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary flex items-center justify-center mb-4">
                <ShieldCheck className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Curated Partners</h3>
              <p className="text-muted-foreground">
                We partner with certified organic farms and craft producers that meet strict quality standards.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-organic-green flex items-center justify-center mb-4">
                <Leaf className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Shop with Context</h3>
              <p className="text-muted-foreground">
                Explore seasonal products along with farm profiles, methods, and origin.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-harvest-orange flex items-center justify-center mb-4">
                <TruckIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Easy Logistics</h3>
              <p className="text-muted-foreground">
                A BioBridge coordinator picks up items directly from the producer and delivers to your location.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-fresh-green flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Fresh, Reliable Delivery</h3>
              <p className="text-muted-foreground">Farm-level freshness with the convenience of modern commerce.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why BioBridge */}
      <section id="why-biobridge" ref={whyBioBridge.ref} className={`py-24 bg-secondary/30 transition-all duration-1000 ${whyBioBridge.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-foreground">Why BioBridge</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-card p-8 rounded-lg shadow-sm border border-border">
              <Sprout className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-semibold mb-3 text-foreground">Freshness You Can Taste</h3>
              <p className="text-muted-foreground">
                Shorter time from harvest to plate means peak flavor and nutrition.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-sm border border-border">
              <ShieldCheck className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-semibold mb-3 text-foreground">Full Transparency</h3>
              <p className="text-muted-foreground">Clear sourcing, methods, and producer stories for every item.</p>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-sm border border-border">
              <CheckCircle2 className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-semibold mb-3 text-foreground">Exceptional Quality</h3>
              <p className="text-muted-foreground">A curated selection from trusted partners who share our values.</p>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-sm border border-border">
              <Leaf className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-semibold mb-3 text-foreground">Sustainability in Practice</h3>
              <p className="text-muted-foreground">Support local, organic agriculture and responsible production.</p>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-sm border border-border">
              <TruckIcon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-semibold mb-3 text-foreground">Effortless Convenience</h3>
              <p className="text-muted-foreground">Premium products, delivered with care to your doorstep.</p>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-sm border border-border">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-semibold mb-3 text-foreground">Community Connection</h3>
              <p className="text-muted-foreground">Build relationships with the farmers who grow your food.</p>
            </div>
          </div>
        </div>
      </section>

      {/* For Producers */}
      <section id="for-producers" ref={forProducers.ref} className={`py-24 bg-cover bg-center relative transition-all duration-1000 ${forProducers.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{
      backgroundImage: `url(${farmImage})`
    }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">For Producers</h2>
            <p className="text-xl text-white/90 mb-8">
              Join a network that values quality and integrity. BioBridge highlights your products, your practices, and
              your brand - while we support visibility, ordering, and last-mile logistics.
            </p>
            <div className="space-y-4 mb-10">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-fresh-green mt-1 flex-shrink-0" />
                <p className="text-lg text-white">Reach customers who care about quality and origin</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-fresh-green mt-1 flex-shrink-0" />
                <p className="text-lg text-white">Present your farm story and methods with clarity</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-fresh-green mt-1 flex-shrink-0" />
                <p className="text-lg text-white">Let us simplify the operational overhead</p>
              </div>
            </div>
            <Button size="lg" className="text-lg px-8 py-6" onClick={() => setFormOpen(true)}>
              Join as a Producer
            </Button>
          </div>
        </div>
      </section>

      {/* Our Difference */}
      <section ref={ourDifference.ref} className={`py-24 bg-card transition-all duration-1000 ${ourDifference.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">Our Difference</h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-12">
            We combine careful selection, transparent storytelling, and hands-on logistics to deliver organic food that
            stands up to scrutiny—on taste, on quality, and on values.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link to="/marketplace">Shop Fresh Produce</Link>
            </Button>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" onClick={() => setFormOpen(true)}>
              Join as a Producer
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-primary-foreground">
              <h3 className="text-2xl font-bold mb-2">BioBridge</h3>
              <p className="text-primary-foreground/80">From Certified Organic Farms to Your Door</p>
            </div>
            <div className="flex gap-8 text-primary-foreground/80">
              <button onClick={() => scrollToSection("how-it-works")} className="hover:text-primary-foreground transition-colors">
                How It Works
              </button>
              <button onClick={() => scrollToSection("why-biobridge")} className="hover:text-primary-foreground transition-colors">
                Why BioBridge
              </button>
              <button onClick={() => scrollToSection("for-producers")} className="hover:text-primary-foreground transition-colors">
                For Producers
              </button>
              <Link to="/auth" className="hover:text-primary-foreground transition-colors">
                Admin Login
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center text-primary-foreground/60">
            <p>© 2024 BioBridge. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <ProducerForm open={formOpen} onOpenChange={setFormOpen} />
    </div>;
};
export default Index;