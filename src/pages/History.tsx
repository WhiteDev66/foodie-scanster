
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, Heart, Share2, Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MobileHeader from "@/components/MobileHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { getHistory, clearHistory, getFavorites, toggleFavorite, shareProduct } from "@/services/storage";
import { SavedProduct } from "@/types/api";
import { useToast } from "@/hooks/use-toast";

const ProductCard = ({ product, onToggleFavorite, onShare }: { 
  product: SavedProduct;
  onToggleFavorite: (product: SavedProduct) => void;
  onShare: (product: SavedProduct) => void;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex items-start space-x-4 relative">
      <div className="absolute top-2 right-2 flex space-x-2">
        <Button
          variant="ghost" 
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product);
          }}
          aria-label={product.isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`h-5 w-5 ${product.isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onShare(product);
          }}
          aria-label="Share product"
        >
          <Share2 className="h-5 w-5 text-gray-400" />
        </Button>
      </div>
      
      <div className="flex-shrink-0" onClick={() => navigate(`/product/${product.code}`)}>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.product_name || t("product.unknownProduct")}
            className="h-16 w-16 object-contain rounded"
          />
        ) : (
          <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
        )}
      </div>
      
      <div className="flex-1" onClick={() => navigate(`/product/${product.code}`)}>
        <h3 className="font-medium">
          {product.product_name || t("product.unknownProduct")}
        </h3>
        
        <div className="flex items-center mt-1 text-sm text-gray-500">
          {product.nutriscore_grade && (
            <div className="mr-2">
              <span className="font-medium">{t("product.nutriscore.label")}:</span>{" "}
              <span className={`inline-block w-6 h-6 rounded-full text-white font-bold text-center ${
                product.nutriscore_grade.toUpperCase() === 'A' ? 'bg-green-500' :
                product.nutriscore_grade.toUpperCase() === 'B' ? 'bg-lime-500' :
                product.nutriscore_grade.toUpperCase() === 'C' ? 'bg-yellow-400' :
                product.nutriscore_grade.toUpperCase() === 'D' ? 'bg-orange-500' :
                product.nutriscore_grade.toUpperCase() === 'E' ? 'bg-red-500' : 'bg-gray-300'
              }`}>
                {product.nutriscore_grade.toUpperCase()}
              </span>
            </div>
          )}
          
          <div className="text-xs text-gray-400 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>
              {new Date(product.savedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const History = () => {
  const [history, setHistory] = useState<SavedProduct[]>([]);
  const [favorites, setFavorites] = useState<SavedProduct[]>([]);
  const [activeTab, setActiveTab] = useState("history");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setHistory(getHistory());
    setFavorites(getFavorites());
  };

  const handleToggleFavorite = (product: SavedProduct) => {
    const isFav = toggleFavorite(product);
    
    toast({
      title: isFav 
        ? t("history.addedToFavorites", "Added to favorites") 
        : t("history.removedFromFavorites", "Removed from favorites"),
      description: product.product_name,
      duration: 2000
    });
    
    loadData();
  };

  const handleShare = async (product: SavedProduct) => {
    const success = await shareProduct(product);
    if (!success) {
      toast({
        title: t("history.shareNotSupported", "Sharing not supported"),
        description: t("history.copyLinkInstead", "Please copy the link manually"),
        variant: "destructive",
        duration: 3000
      });
    }
  };

  const handleClearHistory = () => {
    clearHistory();
    loadData();
    toast({
      title: t("history.historyCleared", "History cleared"),
      duration: 2000
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isMobile ? <MobileHeader /> : null}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {!isMobile && (
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => navigate(-1)}
                  className="mr-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold text-brand-800">
                  {t("history.title", "History & Favorites")}
                </h1>
              </div>
              
              {activeTab === "history" && history.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleClearHistory}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  {t("history.clearHistory", "Clear history")}
                </Button>
              )}
            </div>
          )}

          <Tabs defaultValue="history" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full mb-4">
              <TabsTrigger value="history">
                <Clock className="h-4 w-4 mr-2" />
                {t("history.historyTab", "History")}
              </TabsTrigger>
              <TabsTrigger value="favorites">
                <Heart className="h-4 w-4 mr-2" />
                {t("history.favoritesTab", "Favorites")}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="history" className="mt-0">
              {history.length > 0 ? (
                <div className="space-y-3">
                  {isMobile && (
                    <div className="flex justify-end mb-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleClearHistory}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        {t("history.clearHistory", "Clear history")}
                      </Button>
                    </div>
                  )}
                  
                  {history.map((product) => (
                    <ProductCard
                      key={`${product.code}-${product.savedAt}`}
                      product={product}
                      onToggleFavorite={handleToggleFavorite}
                      onShare={handleShare}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Clock className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <h3 className="text-lg font-medium text-gray-500">
                    {t("history.noHistory", "No products in history")}
                  </h3>
                  <p className="text-gray-400 mt-1">
                    {t("history.startScanningOrSearching", "Products you scan or search will appear here")}
                  </p>
                  <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={() => navigate("/scan")}>
                      {t("hero.scanButton", "Scan product")}
                    </Button>
                    <Button variant="outline" onClick={() => navigate("/search")}>
                      {t("hero.searchButton", "Search product")}
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="favorites" className="mt-0">
              {favorites.length > 0 ? (
                <div className="space-y-3">
                  {favorites.map((product) => (
                    <ProductCard
                      key={`${product.code}-${product.savedAt}`}
                      product={product}
                      onToggleFavorite={handleToggleFavorite}
                      onShare={handleShare}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Heart className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <h3 className="text-lg font-medium text-gray-500">
                    {t("history.noFavorites", "No favorite products")}
                  </h3>
                  <p className="text-gray-400 mt-1">
                    {t("history.addFavoritesHint", "Tap the heart icon on products to add them to favorites")}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default History;
