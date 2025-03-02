
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Scan, Leaf, ZoomIn } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";

const Index = () => {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const circles = {
    hidden: { scale: 0, opacity: 0 },
    show: { 
      scale: 1, 
      opacity: 1, 
      transition: { 
        duration: 0.8, 
        ease: "easeOut",
        delay: 0.5 
      } 
    },
  };

  const slideIn = {
    hidden: { x: -60, opacity: 0 },
    show: { 
      x: 0, 
      opacity: 1, 
      transition: { 
        duration: 0.8, 
        ease: "easeOut",
        delay: 0.2 
      } 
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white relative overflow-hidden">
      {/* Decorative circles */}
      <motion.div 
        className="absolute top-20 right-10 w-64 h-64 rounded-full bg-brand-100/30 -z-10"
        variants={circles}
        initial="hidden"
        animate="show"
      />
      <motion.div 
        className="absolute bottom-40 left-10 w-40 h-40 rounded-full bg-green-100/40 -z-10"
        variants={circles}
        initial="hidden"
        animate="show"
      />
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-amber-100/20 -z-10"
        variants={circles}
        initial="hidden"
        animate="show"
      />

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        {/* Language selection */}
        <div className="flex justify-end mb-6">
          <div className="flex space-x-2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
            {(['fr', 'en', 'es', 'de'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`text-sm px-3 py-1 rounded-full transition-colors ${
                  language === lang 
                    ? 'bg-brand-500 text-white font-medium' 
                    : 'hover:bg-gray-100'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <motion.h1 
            variants={item} 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-900 mb-4"
          >
            {t("index_title")}
          </motion.h1>
          <motion.p 
            variants={item} 
            className="text-xl text-brand-700 mb-8"
          >
            {t("index_subtitle")}
          </motion.p>
          
          <motion.div 
            variants={item}
            className="flex flex-col md:flex-row gap-4 justify-center"
          >
            <Button 
              size="lg" 
              onClick={() => navigate("/scan")}
              className="px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-brand-600 hover:bg-brand-700"
            >
              <Scan className="mr-2 h-5 w-5" />
              {t("scan_button")}
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/search")}
              className="px-8 py-6 text-lg border-brand-300 hover:bg-brand-50 text-brand-700"
            >
              <Search className="mr-2 h-5 w-5" />
              {t("search_button")}
            </Button>
          </motion.div>
        </motion.div>

        <motion.h2 
          variants={slideIn}
          initial="hidden"
          animate="show"
          className="text-2xl md:text-3xl font-semibold text-center text-brand-800 mb-12 md:mb-16"
        >
          {t("about_title")}
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {/* Feature 1 */}
          <motion.div 
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="mx-auto bg-brand-100 w-20 h-20 rounded-full flex items-center justify-center mb-6">
              <Scan className="h-10 w-10 text-brand-600" />
            </div>
            <h3 className="text-xl font-semibold text-brand-800 mb-3">{t("scan_title")}</h3>
            <p className="text-brand-600">{t("scan_description")}</p>
            <div className="mt-6 flex justify-center">
              <img 
                src="/lovable-uploads/bb75613c-5fd1-4978-b9e8-09da991e4a56.png" 
                alt="Scan barcode" 
                className="w-32 h-32 object-contain rounded-lg shadow-sm" 
              />
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="mx-auto bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mb-6">
              <ZoomIn className="h-10 w-10 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-brand-800 mb-3">{t("discover_title")}</h3>
            <p className="text-brand-600">{t("discover_description")}</p>
            <div className="mt-6 flex justify-center">
              <div className="w-32 h-32 bg-gray-100 rounded-lg shadow-sm flex items-center justify-center overflow-hidden">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/1046/1046857.png" 
                  alt="Nutritional information" 
                  className="w-24 h-24 object-contain" 
                />
              </div>
            </div>
          </motion.div>

          {/* Feature 3 */}
          <motion.div 
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="mx-auto bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mb-6">
              <Leaf className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-brand-800 mb-3">{t("health_title")}</h3>
            <p className="text-brand-600">{t("health_description")}</p>
            <div className="mt-6 flex justify-center">
              <div className="w-32 h-32 bg-gray-100 rounded-lg shadow-sm flex items-center justify-center overflow-hidden">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/2515/2515183.png" 
                  alt="Healthy eating" 
                  className="w-24 h-24 object-contain" 
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;
