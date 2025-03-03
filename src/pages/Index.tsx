
import { Search, Camera, ArrowRight, Apple, Leaf, AlertCircle, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    // Déclencher les animations séquentiellement
    setIsVisible(true);
    
    const timer = setTimeout(() => {
      setAnimationStep(1);
    }, 300);
    
    const timer2 = setTimeout(() => {
      setAnimationStep(2);
    }, 600);
    
    const timer3 = setTimeout(() => {
      setAnimationStep(3);
    }, 900);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <header className="relative bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Apple className="h-8 w-8 text-brand-600 animate-bounce" />
            <span className="text-xl font-semibold text-brand-600">Foodie Scan</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/search" className="text-brand-600 hover:text-brand-700 hover:scale-105 transition-all duration-300">
              Rechercher
            </Link>
            <Link to="/scan" className="text-brand-600 hover:text-brand-700 hover:scale-105 transition-all duration-300">
              Scanner
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="py-20 px-4 relative overflow-hidden">
          {/* Éléments de fond animés */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-100 rounded-full opacity-50 animate-pulse"></div>
          <div className="absolute top-40 -left-20 w-40 h-40 bg-brand-200 rounded-full opacity-40 animate-pulse" style={{ animationDelay: "1s" }}></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-brand-300 rounded-full opacity-30 animate-pulse" style={{ animationDelay: "1.5s" }}></div>
          <div className="absolute top-60 right-40 w-24 h-24 bg-brand-100 rounded-full opacity-40 animate-pulse" style={{ animationDelay: "2s" }}></div>
          
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className={`text-center space-y-8 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h1 className="text-4xl md:text-6xl font-bold text-brand-800">
                Découvrez ce qu'il y a dans vos aliments
              </h1>
              <p className="text-xl text-brand-600 max-w-2xl mx-auto">
                Scannez, recherchez et découvrez la composition nutritionnelle de vos produits alimentaires en quelques secondes.
              </p>
              
              <div className="flex justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800&h=500" 
                  alt="Personne scannant un produit alimentaire" 
                  className={`rounded-lg shadow-lg max-w-full md:max-w-xl mx-auto mb-6 transition-all hover:shadow-xl hover:-translate-y-1 duration-300 ${animationStep >= 1 ? 'animate-fadeIn opacity-100' : 'opacity-0'}`}
                />
              </div>
              
              <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 ${animationStep >= 2 ? 'animate-fadeIn opacity-100' : 'opacity-0'}`}>
                <Link
                  to="/scan"
                  className="btn-primary w-full sm:w-auto flex items-center justify-center space-x-2 animate-pulse hover:animate-none"
                >
                  <Camera className="h-5 w-5" />
                  <span>Scanner un produit</span>
                </Link>
                <Link
                  to="/search"
                  className="btn-secondary w-full sm:w-auto flex items-center justify-center space-x-2 transition-all hover:bg-brand-100"
                >
                  <Search className="h-5 w-5" />
                  <span>Rechercher un produit</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-brand-50 relative overflow-hidden">
          {/* Éléments décoratifs animés */}
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/50 rounded-tl-full"></div>
          <div className="absolute top-20 left-10 w-20 h-20 bg-brand-100 rounded-full opacity-40 animate-pulse"></div>
          <div className="absolute bottom-40 left-20 w-16 h-16 bg-brand-200 rounded-full opacity-30 animate-pulse" style={{ animationDelay: "0.7s" }}></div>
          
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className={`text-center mb-12 ${animationStep >= 3 ? 'animate-fadeIn opacity-100' : 'opacity-0'}`}>
              <h2 className="text-3xl font-bold text-brand-800 mb-4">Comment ça fonctionne</h2>
              <p className="text-xl text-brand-600 max-w-2xl mx-auto">
                Une application simple et intuitive pour vous aider à faire des choix alimentaires éclairés
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg bg-white shadow-sm card-hover transform transition-all duration-300 hover:scale-105">
                <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center mb-4">
                  <Camera className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="text-xl font-semibold text-brand-800 mb-2">
                  Scanner facile
                </h3>
                <p className="text-brand-600">
                  Utilisez votre caméra pour scanner le code-barres d'un produit et obtenir instantanément ses informations.
                </p>
                <div className="mt-4 flex justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1552345386-6690de5b2c09?auto=format&fit=crop&q=80&w=300&h=200" 
                    alt="Scanner un code-barres" 
                    className="rounded-md shadow-sm h-32 object-cover transform transition-all duration-500 hover:scale-110"
                  />
                </div>
              </div>
              
              <div className="p-6 rounded-lg bg-white shadow-sm card-hover transform transition-all duration-300 hover:scale-105" style={{ transitionDelay: "0.1s" }}>
                <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="text-xl font-semibold text-brand-800 mb-2">
                  Recherche rapide
                </h3>
                <p className="text-brand-600">
                  Trouvez rapidement les informations sur vos produits grâce à notre moteur de recherche intelligent.
                </p>
                <div className="mt-4 flex justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=300&h=200" 
                    alt="Recherche de produits" 
                    className="rounded-md shadow-sm h-32 object-cover transform transition-all duration-500 hover:scale-110"
                  />
                </div>
              </div>
              
              <div className="p-6 rounded-lg bg-white shadow-sm card-hover transform transition-all duration-300 hover:scale-105" style={{ transitionDelay: "0.2s" }}>
                <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center mb-4">
                  <Leaf className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="text-xl font-semibold text-brand-800 mb-2">
                  Information claire
                </h3>
                <p className="text-brand-600">
                  Accédez à des informations détaillées sur la composition, les allergènes et le score nutritionnel.
                </p>
                <div className="mt-4 flex justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&q=80&w=300&h=200" 
                    alt="Information nutritionnelle" 
                    className="rounded-md shadow-sm h-32 object-cover transform transition-all duration-500 hover:scale-110"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-20 px-4 bg-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-brand-50 to-transparent"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-100 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-0 w-32 h-32 bg-brand-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: "1.2s" }}></div>
          
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-800 mb-4">Faites des choix alimentaires éclairés</h2>
              <p className="text-xl text-brand-600 max-w-3xl mx-auto">
                Découvrez ce que contiennent vraiment vos aliments et prenez soin de votre santé
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <div className="bg-brand-50 p-6 rounded-lg shadow-sm">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="h-10 w-10 rounded-full bg-brand-100 flex-shrink-0 flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-brand-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-brand-800 mb-2">Identifiez les allergènes</h3>
                      <p className="text-brand-600">
                        Repérez rapidement les allergènes potentiels dans vos produits alimentaires et évitez les réactions indésirables.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-brand-50 p-6 rounded-lg shadow-sm mt-4 transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="h-10 w-10 rounded-full bg-brand-100 flex-shrink-0 flex items-center justify-center">
                      <Leaf className="h-5 w-5 text-brand-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-brand-800 mb-2">Évaluez la qualité nutritionnelle</h3>
                      <p className="text-brand-600">
                        Comprenez le Nutri-Score et les groupes NOVA pour faire des choix plus sains au quotidien.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="order-1 md:order-2">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80&w=600&h=400" 
                    alt="Fruits et légumes frais" 
                    className="rounded-lg shadow-lg w-full object-cover transform transition-all duration-500 hover:scale-105"
                  />
                  <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg transform rotate-3 animate-pulse">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-500 font-bold text-xl">A</span>
                      <span className="text-sm text-brand-600">Nutri-Score</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 px-4 bg-gradient-to-r from-brand-700 to-brand-800 text-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold">Prêt à découvrir vos aliments ?</h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Commencez dès maintenant à scanner ou rechercher des produits pour faire des choix plus sains
              </p>
              <div className="pt-4">
                <Link
                  to="/scan"
                  className="btn-primary bg-white text-brand-800 hover:bg-brand-100 inline-flex items-center space-x-2 group"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Commencer maintenant</span>
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-brand-600 mb-4 md:mb-0">
              Powered by Open Food Facts
            </p>
            <div className="flex items-center space-x-4">
              <Link to="/search" className="text-brand-600 hover:text-brand-800 transition-colors">Rechercher</Link>
              <Link to="/scan" className="text-brand-600 hover:text-brand-800 transition-colors">Scanner</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
