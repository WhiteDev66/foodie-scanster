
import React, { useState } from 'react';
import { Menu, X, Apple, Search, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const MobileHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative">
      {/* Main header bar */}
      <header className="bg-white/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <Apple className="h-6 w-6 text-brand-600" />
              <span className="text-lg font-semibold text-brand-600">Foodie Scan</span>
            </Link>
          </div>
          <button 
            onClick={toggleMenu}
            className="p-2 text-brand-600 focus:outline-none"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleMenu}>
          <div 
            className="absolute right-0 top-0 h-full w-3/4 max-w-xs bg-white shadow-xl p-6 transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end">
              <button 
                onClick={toggleMenu}
                className="p-2 text-brand-600 focus:outline-none"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mt-8 space-y-6">
              <Link 
                to="/" 
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-brand-50"
                onClick={toggleMenu}
              >
                <Apple className="h-5 w-5 text-brand-600" />
                <span className="text-brand-600 font-medium">Foodie Scan</span>
              </Link>
              
              <Link 
                to="/search" 
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-brand-50"
                onClick={toggleMenu}
              >
                <Search className="h-5 w-5 text-brand-600" />
                <span className="text-brand-600">{t('header.search')}</span>
              </Link>
              
              <Link 
                to="/scan" 
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-brand-50"
                onClick={toggleMenu}
              >
                <Camera className="h-5 w-5 text-brand-600" />
                <span className="text-brand-600">{t('header.scan')}</span>
              </Link>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-brand-500 mb-2">{t('footer.poweredBy')}</p>
                <LanguageSelector />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileHeader;
