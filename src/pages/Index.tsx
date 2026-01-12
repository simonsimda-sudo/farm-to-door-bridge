import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ProducerForm } from "@/components/ProducerForm";
import { Leaf, TruckIcon, Users, CheckCircle2, Sprout, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-organic-produce.jpg";
import farmImage from "@/assets/farm-landscape.jpg";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { UserMenu } from "@/components/UserMenu";

const Index = () => {
  const { t } = useTranslation();
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

  return (
    <div className="min-h-screen">
      {/* Header Controls - Fixed Position */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <LanguageSwitcher variant="compact" className="bg-white/90 backdrop-blur rounded-lg px-2 py-1 shadow-lg" />
        <div className="bg-white/90 backdrop-blur rounded-lg shadow-lg">
          <UserMenu />
        </div>
      </div>

      {/* Hero Section */}
      <header 
        style={{
          backgroundImage: "url(\"/lovable-uploads/092f2f9a-ca4b-42f3-911d-a6479eef63fb.png\")"
        }} 
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center shadow-xl" 
        role="banner"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl bg-inherit">
            {t('home.hero.title')}
          </h1>
          <p className="text-2xl md:text-3xl text-white mb-4 drop-shadow-lg font-semibold">
            {t('home.hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-45">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link to="/marketplace">{t('common.shopProducts')}</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 bg-white/90 hover:bg-white border-2" 
              onClick={() => setFormOpen(true)}
            >
              {t('common.joinProducer')}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* How It Works */}
        <section 
          id="how-it-works" 
          ref={howItWorks.ref} 
          className={`py-24 bg-card transition-all duration-1000 ${howItWorks.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-foreground">
              {t('home.howItWorks.title')}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div 
                className="text-center space-y-4 transition-all duration-700" 
                style={{
                  opacity: howItWorks.isVisible ? 1 : 0,
                  transform: howItWorks.isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: howItWorks.isVisible ? '100ms' : '0ms'
                }}
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-primary flex items-center justify-center mb-4">
                  <ShieldCheck className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {t('home.howItWorks.curatedPartners.title')}
                </h3>
                <p className="text-muted-foreground">
                  {t('home.howItWorks.curatedPartners.description')}
                </p>
              </div>

              <div 
                className="text-center space-y-4 transition-all duration-700" 
                style={{
                  opacity: howItWorks.isVisible ? 1 : 0,
                  transform: howItWorks.isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: howItWorks.isVisible ? '250ms' : '0ms'
                }}
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-organic-green flex items-center justify-center mb-4">
                  <Leaf className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {t('home.howItWorks.shopWithContext.title')}
                </h3>
                <p className="text-muted-foreground">
                  {t('home.howItWorks.shopWithContext.description')}
                </p>
              </div>

              <div 
                className="text-center space-y-4 transition-all duration-700" 
                style={{
                  opacity: howItWorks.isVisible ? 1 : 0,
                  transform: howItWorks.isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: howItWorks.isVisible ? '400ms' : '0ms'
                }}
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-harvest-orange flex items-center justify-center mb-4">
                  <TruckIcon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {t('home.howItWorks.easyLogistics.title')}
                </h3>
                <p className="text-muted-foreground">
                  {t('home.howItWorks.easyLogistics.description')}
                </p>
              </div>

              <div 
                className="text-center space-y-4 transition-all duration-700" 
                style={{
                  opacity: howItWorks.isVisible ? 1 : 0,
                  transform: howItWorks.isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: howItWorks.isVisible ? '550ms' : '0ms'
                }}
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-fresh-green flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {t('home.howItWorks.freshDelivery.title')}
                </h3>
                <p className="text-muted-foreground">
                  {t('home.howItWorks.freshDelivery.description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why BioBridge */}
        <section 
          id="why-biobridge" 
          ref={whyBioBridge.ref} 
          className={`py-24 bg-secondary/30 transition-all duration-1000 ${whyBioBridge.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-foreground">
              {t('home.whyBiobridge.title')}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div 
                className="bg-card p-8 rounded-lg shadow-sm border border-border transition-all duration-700" 
                style={{
                  opacity: whyBioBridge.isVisible ? 1 : 0,
                  transform: whyBioBridge.isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: whyBioBridge.isVisible ? '100ms' : '0ms'
                }}
              >
                <Sprout className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-semibold mb-3 text-foreground">
                  {t('home.whyBiobridge.freshness.title')}
                </h3>
                <p className="text-muted-foreground">
                  {t('home.whyBiobridge.freshness.description')}
                </p>
              </div>

              <div 
                className="bg-card p-8 rounded-lg shadow-sm border border-border transition-all duration-700" 
                style={{
                  opacity: whyBioBridge.isVisible ? 1 : 0,
                  transform: whyBioBridge.isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: whyBioBridge.isVisible ? '200ms' : '0ms'
                }}
              >
                <ShieldCheck className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-semibold mb-3 text-foreground">
                  {t('home.whyBiobridge.transparency.title')}
                </h3>
                <p className="text-muted-foreground">
                  {t('home.whyBiobridge.transparency.description')}
                </p>
              </div>

              <div 
                className="bg-card p-8 rounded-lg shadow-sm border border-border transition-all duration-700" 
                style={{
                  opacity: whyBioBridge.isVisible ? 1 : 0,
                  transform: whyBioBridge.isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: whyBioBridge.isVisible ? '300ms' : '0ms'
                }}
              >
                <CheckCircle2 className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-semibold mb-3 text-foreground">
                  {t('home.whyBiobridge.quality.title')}
                </h3>
                <p className="text-muted-foreground">
                  {t('home.whyBiobridge.quality.description')}
                </p>
              </div>

              <div 
                className="bg-card p-8 rounded-lg shadow-sm border border-border transition-all duration-700" 
                style={{
                  opacity: whyBioBridge.isVisible ? 1 : 0,
                  transform: whyBioBridge.isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: whyBioBridge.isVisible ? '400ms' : '0ms'
                }}
              >
                <Leaf className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-semibold mb-3 text-foreground">
                  {t('home.whyBiobridge.sustainability.title')}
                </h3>
                <p className="text-muted-foreground">
                  {t('home.whyBiobridge.sustainability.description')}
                </p>
              </div>

              <div 
                className="bg-card p-8 rounded-lg shadow-sm border border-border transition-all duration-700" 
                style={{
                  opacity: whyBioBridge.isVisible ? 1 : 0,
                  transform: whyBioBridge.isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: whyBioBridge.isVisible ? '500ms' : '0ms'
                }}
              >
                <TruckIcon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-semibold mb-3 text-foreground">
                  {t('home.whyBiobridge.convenience.title')}
                </h3>
                <p className="text-muted-foreground">
                  {t('home.whyBiobridge.convenience.description')}
                </p>
              </div>

              <div 
                className="bg-card p-8 rounded-lg shadow-sm border border-border transition-all duration-700" 
                style={{
                  opacity: whyBioBridge.isVisible ? 1 : 0,
                  transform: whyBioBridge.isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: whyBioBridge.isVisible ? '600ms' : '0ms'
                }}
              >
                <Users className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-semibold mb-3 text-foreground">
                  {t('home.whyBiobridge.community.title')}
                </h3>
                <p className="text-muted-foreground">
                  {t('home.whyBiobridge.community.description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* For Producers */}
        <section 
          id="for-producers" 
          ref={forProducers.ref} 
          className={`py-24 bg-cover bg-center relative transition-all duration-1000 ${forProducers.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} 
          style={{
            backgroundImage: `url(${farmImage})`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                {t('home.forProducers.title')}
              </h2>
              <p className="text-xl text-white/90 mb-8">
                {t('home.forProducers.description')}
              </p>
              <div className="space-y-4 mb-10">
                <div 
                  className="flex items-start gap-3 transition-all duration-700" 
                  style={{
                    opacity: forProducers.isVisible ? 1 : 0,
                    transform: forProducers.isVisible ? 'translateX(0)' : 'translateX(-20px)',
                    transitionDelay: forProducers.isVisible ? '200ms' : '0ms'
                  }}
                >
                  <CheckCircle2 className="w-6 h-6 text-fresh-green mt-1 flex-shrink-0" />
                  <p className="text-lg text-white">{t('home.forProducers.benefit1')}</p>
                </div>
                <div 
                  className="flex items-start gap-3 transition-all duration-700" 
                  style={{
                    opacity: forProducers.isVisible ? 1 : 0,
                    transform: forProducers.isVisible ? 'translateX(0)' : 'translateX(-20px)',
                    transitionDelay: forProducers.isVisible ? '350ms' : '0ms'
                  }}
                >
                  <CheckCircle2 className="w-6 h-6 text-fresh-green mt-1 flex-shrink-0" />
                  <p className="text-lg text-white">{t('home.forProducers.benefit2')}</p>
                </div>
                <div 
                  className="flex items-start gap-3 transition-all duration-700" 
                  style={{
                    opacity: forProducers.isVisible ? 1 : 0,
                    transform: forProducers.isVisible ? 'translateX(0)' : 'translateX(-20px)',
                    transitionDelay: forProducers.isVisible ? '500ms' : '0ms'
                  }}
                >
                  <CheckCircle2 className="w-6 h-6 text-fresh-green mt-1 flex-shrink-0" />
                  <p className="text-lg text-white">{t('home.forProducers.benefit3')}</p>
                </div>
              </div>
              <Button size="lg" className="text-lg px-8 py-6" onClick={() => setFormOpen(true)}>
                {t('common.joinProducer')}
              </Button>
            </div>
          </div>
        </section>

        {/* Our Difference */}
        <section 
          ref={ourDifference.ref} 
          className={`py-24 bg-card transition-all duration-1000 ${ourDifference.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">
              {t('home.ourDifference.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-12">
              {t('home.ourDifference.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link to="/marketplace">{t('home.ourDifference.shopProduce')}</Link>
              </Button>
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6" onClick={() => setFormOpen(true)}>
                {t('common.joinProducer')}
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-primary-foreground">
              <h3 className="text-2xl font-bold mb-2">{t('common.biobridge')}</h3>
              <p className="text-primary-foreground/80">{t('common.tagline')}</p>
            </div>
            <div className="flex gap-8 text-primary-foreground/80">
              <button 
                onClick={() => scrollToSection("how-it-works")} 
                className="hover:text-primary-foreground transition-colors"
              >
                {t('common.howItWorks')}
              </button>
              <button 
                onClick={() => scrollToSection("why-biobridge")} 
                className="hover:text-primary-foreground transition-colors"
              >
                {t('common.whyBiobridge')}
              </button>
              <button 
                onClick={() => scrollToSection("for-producers")} 
                className="hover:text-primary-foreground transition-colors"
              >
                {t('common.forProducers')}
              </button>
              <Link to="/auth" className="hover:text-primary-foreground transition-colors">
                {t('common.adminLogin')}
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center text-primary-foreground/60">
            <p>{t('common.copyright', { year: new Date().getFullYear() })}</p>
          </div>
        </div>
      </footer>

      <ProducerForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
};

export default Index;
