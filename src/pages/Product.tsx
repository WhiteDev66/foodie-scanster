import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CircleAlert, Heart, AlertTriangle, ThumbsUp, AlertCircle, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { addToHistory, isFavorite, toggleFavorite, shareProduct } from "@/services/storage";

const NutritionValue = ({ label, value, unit = "g" }: { 
  label: string; 
  value: string | number | undefined | null; 
  unit?: string 
}) => {
  if (value === undefined || value === null) return null;
  
  return (
    <div className="text-gray-600 bg-white/50 p-2 rounded-md flex justify-between">
      <span>{label}:</span>
      <span className="font-medium text-[#52769b]">
        {typeof value === 'number' ? value.toFixed(value % 1 === 0 ? 0 : 1) : value}
        {unit}
      </span>
    </div>
  );
};

const Nutriscore = ({ grade }: { grade: string | undefined | null }) => {
  const { t } = useTranslation();
  
  if (!grade) return null;
  
  const getColor = (score: string) => {
    switch (score.toUpperCase()) {
      case 'A': return 'bg-green-500';
      case 'B': return 'bg-lime-500';
      case 'C': return 'bg-yellow-400';
      case 'D': return 'bg-orange-500';
      case 'E': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };
  
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="font-medium">{t("product.nutriscore.label", "Nutriscore")}:</span>
      <div className={`${getColor(grade)} text-white font-bold w-8 h-8 rounded-full flex items-center justify-center`}>
        {grade.toUpperCase()}
      </div>
    </div>
  );
};

const NovaGroup = ({ group }: { group: string | number | undefined | null }) => {
  const { t } = useTranslation();
  
  if (group === undefined || group === null) return null;
  
  const novaNumber = typeof group === 'string' ? parseInt(group, 10) : group;
  
  const getColor = (nova: number) => {
    switch (nova) {
      case 1: return 'bg-green-500';
      case 2: return 'bg-yellow-400';
      case 3: return 'bg-orange-500';
      case 4: return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };
  
  const getDescription = (nova: number) => {
    switch (nova) {
      case 1: return t("product.nova.group1", "Aliments non transformés ou transformés minimalement");
      case 2: return t("product.nova.group2", "Ingrédients culinaires transformés");
      case 3: return t("product.nova.group3", "Aliments transformés");
      case 4: return t("product.nova.group4", "Produits alimentaires et boissons ultra-transformés");
      default: return t("product.nova.unknown", "Information non disponible");
    }
  };
  
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-medium">{t("product.nova.label", "Groupe NOVA")}:</span>
        <div className={`${getColor(novaNumber)} text-white font-bold w-8 h-8 rounded-full flex items-center justify-center`}>
          {novaNumber}
        </div>
      </div>
      <p className="text-sm text-gray-600">{getDescription(novaNumber)}</p>
    </div>
  );
};

const HealthAssessment = ({ product }: { product: any }) => {
  const { t } = useTranslation();
  
  if (!product) return null;
  
  const nutriscoreGrade = product.nutriscore_grade?.toUpperCase();
  const novaGroup = product.nova_group ? (typeof product.nova_group === 'string' ? parseInt(product.nova_group, 10) : product.nova_group) : null;
  const sugarContent = product.nutriments?.sugars;
  const saltContent = product.nutriments?.salt;
  const fatContent = product.nutriments?.fat;
  const saturatedFatContent = product.nutriments?.["saturated-fat"];
  
  const isHealthy = (
    (nutriscoreGrade === 'A' || nutriscoreGrade === 'B') && 
    (novaGroup === 1 || novaGroup === 2)
  );
  
  const isUnhealthy = (
    (nutriscoreGrade === 'D' || nutriscoreGrade === 'E') || 
    novaGroup === 4
  );
  
  const healthRisks = [];
  
  if (sugarContent && sugarContent > 10) {
    healthRisks.push(t("product.health.risks.sugar", "Risque de diabète et d'obésité en cas de consommation excessive"));
  }
  
  if (saltContent && saltContent > 1.5) {
    healthRisks.push(t("product.health.risks.salt", "Risque d'hypertension artérielle en cas de consommation excessive"));
  }
  
  if (fatContent && fatContent > 15) {
    healthRisks.push(t("product.health.risks.fat", "Risque de problèmes cardiovasculaires en cas de consommation excessive"));
  }
  
  if (saturatedFatContent && saturatedFatContent > 5) {
    healthRisks.push(t("product.health.risks.saturatedFat", "Risque accru de maladies cardiaques en cas de consommation excessive"));
  }
  
  if (novaGroup === 4) {
    healthRisks.push(t("product.health.risks.ultraProcessed", "Les aliments ultra-transformés sont associés à un risque accru de cancer, d'obésité et de maladies cardiaques"));
  }
  
  return (
    <div className="bg-white/80 rounded-lg shadow-sm p-4 mb-4">
      <h2 className="text-lg font-semibold mb-3">{t("product.health.title", "Évaluation de la santé")}</h2>
      
      <div className={`p-3 rounded-md mb-4 flex gap-2 items-center ${isHealthy ? 'bg-green-100' : isUnhealthy ? 'bg-red-100' : 'bg-yellow-100'}`}>
        {isHealthy ? (
          <ThumbsUp className="h-5 w-5 text-green-600" />
        ) : isUnhealthy ? (
          <AlertTriangle className="h-5 w-5 text-red-600" />
        ) : (
          <AlertCircle className="h-5 w-5 text-yellow-600" />
        )}
        <span className={`font-medium ${isHealthy ? 'text-green-800' : isUnhealthy ? 'text-red-800' : 'text-yellow-800'}`}>
          {isHealthy 
            ? t("product.health.good", "Ce produit est généralement bon pour la santé")
            : isUnhealthy 
              ? t("product.health.bad", "Ce produit n'est pas recommandé pour une consommation régulière")
              : t("product.health.moderate", "Ce produit est à consommer avec modération")}
        </span>
      </div>
      
      {healthRisks.length > 0 && (
        <div>
          <h3 className="text-md font-medium mb-2 text-red-700">{t("product.health.risksTitle", "Risques potentiels pour la santé")}:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            {healthRisks.map((risk, index) => (
              <li key={index}>{risk}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const Product = () => {
  const { barcode } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const [isFavorited, setIsFavorited] = useState(false);
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", barcode, i18n.language],
    queryFn: async () => {
      const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);
      if (!response.ok) {
        throw new Error("Produit non trouvé");
      }
      const data = await response.json();
      return data.product;
    },
  });
  
  useEffect(() => {
    if (product && barcode) {
      addToHistory(product);
      setIsFavorited(isFavorite(barcode));
    }
  }, [product, barcode]);
  
  const handleToggleFavorite = () => {
    if (product) {
      const newState = toggleFavorite(product);
      setIsFavorited(newState);
      
      toast({
        title: newState 
          ? t("product.addedToFavorites", "Added to favorites") 
          : t("product.removedFromFavorites", "Removed from favorites"),
        description: product.product_name,
        duration: 2000
      });
    }
  };
  
  const handleShare = async () => {
    if (product) {
      const success = await shareProduct(product);
      if (!success) {
        toast({
          title: t("product.shareNotSupported", "Sharing not supported"),
          description: t("product.copyLinkInstead", "Please copy the link manually"),
          variant: "destructive",
          duration: 3000
        });
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">{t("product.loading", "Chargement du produit...")}</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-screen">
        <CircleAlert className="h-12 w-12 text-red-500" />
        <p className="mt-4 text-red-600">{t("product.error", "Erreur lors du chargement du produit")}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate(-1)}
        >
          {t("product.back", "Retour")}
        </Button>
      </div>
    );
  }
  
  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleFavorite}
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`h-5 w-5 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            aria-label="Share product"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {product?.image_url && (
        <div className="mb-4 flex justify-center">
          <img
            src={product.image_url}
            alt={product.product_name || t("product.unknownProduct", "Product image")}
            className="rounded-lg shadow-md max-h-64 object-contain"
          />
        </div>
      )}
      
      <h1 className="text-2xl font-bold mb-2">{product?.product_name || t("product.unknownProduct", "Produit inconnu")}</h1>
      
      {product?.brands && (
        <p className="text-gray-600 mb-4">{product.brands}</p>
      )}
      
      <HealthAssessment product={product} />
      
      {product?.nutriscore_grade && (
        <Nutriscore grade={product.nutriscore_grade} />
      )}
      
      {product?.nova_group && (
        <NovaGroup group={product.nova_group} />
      )}
      
      <div className="bg-white/80 rounded-lg shadow-sm p-4 mb-4">
        <h2 className="text-lg font-semibold mb-3">{t("product.nutrition.title", "Information nutritionnelle")}</h2>
        <div className="space-y-2">
          <NutritionValue label={t("product.nutrition.energy", "Énergie")} value={product?.nutriments?.energy} unit="kJ" />
          <NutritionValue label={t("product.nutrition.fat", "Matières grasses")} value={product?.nutriments?.fat} />
          <NutritionValue label={t("product.nutrition.saturatedFat", "dont acides gras saturés")} value={product?.nutriments?.["saturated-fat"]} />
          <NutritionValue label={t("product.nutrition.carbs", "Glucides")} value={product?.nutriments?.carbohydrates} />
          <NutritionValue label={t("product.nutrition.sugars", "dont sucres")} value={product?.nutriments?.sugars} />
          <NutritionValue label={t("product.nutrition.fiber", "Fibres alimentaires")} value={product?.nutriments?.fiber} />
          <NutritionValue label={t("product.nutrition.proteins", "Protéines")} value={product?.nutriments?.proteins} />
          <NutritionValue label={t("product.nutrition.salt", "Sel")} value={product?.nutriments?.salt} />
        </div>
      </div>
      
      {product?.ingredients_text && (
        <div className="bg-white/80 rounded-lg shadow-sm p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">{t("product.ingredients.title", "Ingrédients")}</h2>
          <p className="text-gray-700 text-sm">{product.ingredients_text}</p>
        </div>
      )}
      
      {product?.allergens && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <h2 className="text-lg font-semibold text-red-700 mb-2">{t("product.allergens.title", "Allergènes")}</h2>
          <p className="text-red-600">{product.allergens}</p>
        </div>
      )}
    </div>
  );
};

export default Product;
