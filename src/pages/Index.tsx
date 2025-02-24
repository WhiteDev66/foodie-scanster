
import { Search, Camera, ArrowRight, Apple, Leaf } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen">
      <header className="relative bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Apple className="h-8 w-8 text-brand-600" />
            <span className="text-xl font-semibold text-brand-600">Foodie Scan</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/search" className="text-brand-600 hover:text-brand-700">
              Rechercher
            </Link>
            <Link to="/scan" className="text-brand-600 hover:text-brand-700">
              Scanner
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center space-y-8 animate-fadeIn">
              <h1 className="text-4xl md:text-6xl font-bold text-brand-800">
                Découvrez ce qu'il y a dans vos aliments
              </h1>
              <p className="text-xl text-brand-600 max-w-2xl mx-auto">
                Scannez, recherchez et découvrez la composition nutritionnelle de vos produits alimentaires en quelques secondes.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                <Link
                  to="/scan"
                  className="btn-primary w-full sm:w-auto flex items-center justify-center space-x-2"
                >
                  <Camera className="h-5 w-5" />
                  <span>Scanner un produit</span>
                </Link>
                <Link
                  to="/search"
                  className="btn-secondary w-full sm:w-auto flex items-center justify-center space-x-2"
                >
                  <Search className="h-5 w-5" />
                  <span>Rechercher un produit</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-brand-50">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg bg-white shadow-sm card-hover">
                <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center mb-4">
                  <Camera className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="text-xl font-semibold text-brand-800 mb-2">
                  Scanner facile
                </h3>
                <p className="text-brand-600">
                  Utilisez votre caméra pour scanner le code-barres d'un produit et obtenir instantanément ses informations.
                </p>
              </div>
              <div className="p-6 rounded-lg bg-white shadow-sm card-hover">
                <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="text-xl font-semibold text-brand-800 mb-2">
                  Recherche rapide
                </h3>
                <p className="text-brand-600">
                  Trouvez rapidement les informations sur vos produits grâce à notre moteur de recherche intelligent.
                </p>
              </div>
              <div className="p-6 rounded-lg bg-white shadow-sm card-hover">
                <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center mb-4">
                  <Leaf className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="text-xl font-semibold text-brand-800 mb-2">
                  Information claire
                </h3>
                <p className="text-brand-600">
                  Accédez à des informations détaillées sur la composition, les allergènes et le score nutritionnel.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-brand-600">
            Powered by Open Food Facts
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
