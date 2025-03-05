
import { Search, Camera, ArrowRight, Apple, Leaf, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../components/LanguageSelector";
import MobileHeader from "../components/MobileHeader";
import { useIsMobile } from "../hooks/use-mobile";

const Index = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Déclencher l'animation après le chargement de la page
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen">
      {isMobile ? (
        <MobileHeader />
      ) : (
        <header className="relative bg-white/80 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 py-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Apple className="h-8 w-8 text-brand-600" />
              <span className="text-xl font-semibold text-brand-600">Foodie Scan</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/search" className="text-brand-600 hover:text-brand-700">
                {t('header.search')}
              </Link>
              <Link to="/scan" className="text-brand-600 hover:text-brand-700">
                {t('header.scan')}
              </Link>
            </nav>
          </div>
        </header>
      )}

      <main>
        <section className="py-20 px-4 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-100 rounded-full opacity-50 animate-pulse"></div>
          <div className="absolute top-40 -left-20 w-40 h-40 bg-brand-200 rounded-full opacity-40 animate-pulse" style={{ animationDelay: "1s" }}></div>
          
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className={`text-center space-y-8 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="flex items-center justify-center mb-4">
                <LanguageSelector />
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-brand-800">
                {t('hero.title')}
              </h1>
              <p className="text-xl text-brand-600 max-w-2xl mx-auto">
                {t('hero.subtitle')}
              </p>
              
              <div className="flex justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800&h=500" 
                  alt="Personne scannant un produit alimentaire" 
                  className="rounded-lg shadow-lg max-w-full md:max-w-xl mx-auto mb-6 transition-all hover:shadow-xl hover:-translate-y-1 duration-300"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  to="/scan"
                  className="btn-primary w-full sm:w-auto flex items-center justify-center space-x-2 animate-pulse hover:animate-none"
                >
                  <Camera className="h-5 w-5" />
                  <span>{t('hero.scanButton')}</span>
                </Link>
                <Link
                  to="/search"
                  className="btn-secondary w-full sm:w-auto flex items-center justify-center space-x-2 transition-all hover:bg-brand-100"
                >
                  <Search className="h-5 w-5" />
                  <span>{t('hero.searchButton')}</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-brand-50 relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/50 rounded-tl-full"></div>
          
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-800 mb-4">{t('howItWorks.title')}</h2>
              <p className="text-xl text-brand-600 max-w-2xl mx-auto">
                {t('howItWorks.subtitle')}
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg bg-white shadow-sm card-hover transform transition-all duration-300 hover:scale-105">
                <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center mb-4">
                  <Camera className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="text-xl font-semibold text-brand-800 mb-2">
                  {t('howItWorks.card1.title')}
                </h3>
                <p className="text-brand-600">
                  {t('howItWorks.card1.description')}
                </p>
                <div className="mt-4 flex justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1512223792601-592a9809eed4?auto=format&fit=crop&q=80&w=300&h=200" 
                    alt="Scanner un code-barres" 
                    className="rounded-md shadow-sm h-32 object-cover"
                  />
                </div>
              </div>
              
              <div className="p-6 rounded-lg bg-white shadow-sm card-hover transform transition-all duration-300 hover:scale-105" style={{ transitionDelay: "0.1s" }}>
                <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="text-xl font-semibold text-brand-800 mb-2">
                  {t('howItWorks.card2.title')}
                </h3>
                <p className="text-brand-600">
                  {t('howItWorks.card2.description')}
                </p>
                <div className="mt-4 flex justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&q=80&w=300&h=200" 
                    alt="Recherche de produits" 
                    className="rounded-md shadow-sm h-32 object-cover"
                  />
                </div>
              </div>
              
              <div className="p-6 rounded-lg bg-white shadow-sm card-hover transform transition-all duration-300 hover:scale-105" style={{ transitionDelay: "0.2s" }}>
                <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center mb-4">
                  <Leaf className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="text-xl font-semibold text-brand-800 mb-2">
                  {t('howItWorks.card3.title')}
                </h3>
                <p className="text-brand-600">
                  {t('howItWorks.card3.description')}
                </p>
                <div className="mt-4 flex justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80&w=300&h=200" 
                    alt="Information nutritionnelle" 
                    className="rounded-md shadow-sm h-32 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 px-4 bg-gradient-to-r from-brand-700 to-brand-800 text-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold">{t('cta.title')}</h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                {t('cta.subtitle')}
              </p>
              <div className="pt-4">
                <Link
                  to="/scan"
                  className="btn-primary bg-white text-brand-800 hover:bg-brand-100 inline-flex items-center space-x-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>{t('cta.button')}</span>
                  <ArrowRight className="h-5 w-5 ml-2 animate-bounce" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-brand-600">
            {t('footer.poweredBy')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
