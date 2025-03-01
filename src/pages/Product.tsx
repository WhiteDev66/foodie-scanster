
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CircleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Composant pour afficher une valeur nutritionnelle formatée
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

// Composant pour afficher le Nutriscore avec les couleurs appropriées
const Nutriscore = ({ grade }: { grade: string | undefined | null }) => {
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
      <span className="font-medium">Nutriscore:</span>
      <div className={`${getColor(grade)} text-white font-bold w-8 h-8 rounded-full flex items-center justify-center`}>
        {grade.toUpperCase()}
      </div>
    </div>
  );
};

// Composant pour afficher le groupe NOVA
const NovaGroup = ({ group }: { group: string | number | undefined | null }) => {
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
      case 1: return 'Aliments non transformés ou transformés minimalement';
      case 2: return 'Ingrédients culinaires transformés';
      case 3: return 'Aliments transformés';
      case 4: return 'Produits alimentaires et boissons ultra-transformés';
      default: return 'Information non disponible';
    }
  };
  
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-medium">Groupe NOVA:</span>
        <div className={`${getColor(novaNumber)} text-white font-bold w-8 h-8 rounded-full flex items-center justify-center`}>
          {novaNumber}
        </div>
      </div>
      <p className="text-sm text-gray-600">{getDescription(novaNumber)}</p>
    </div>
  );
};

const Product = () => {
  const { barcode } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", barcode],
    queryFn: async () => {
      const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);
      if (!response.ok) {
        throw new Error("Produit non trouvé");
      }
      const data = await response.json();
      return data.product;
    },
  });
  
  if (isLoading) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Chargement du produit...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-screen">
        <CircleAlert className="h-12 w-12 text-red-500" />
        <p className="mt-4 text-red-600">Erreur lors du chargement du produit</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate(-1)}
        >
          Retour
        </Button>
      </div>
    );
  }
  
  return (
    <div className="p-4 max-w-lg mx-auto">
      <Button
        variant="ghost"
        size="icon"
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      
      {product?.image_url && (
        <div className="mb-4 flex justify-center">
          <img
            src={product.image_url}
            alt={product.product_name || "Product image"}
            className="rounded-lg shadow-md max-h-64 object-contain"
          />
        </div>
      )}
      
      <h1 className="text-2xl font-bold mb-2">{product?.product_name || "Produit inconnu"}</h1>
      
      {product?.brands && (
        <p className="text-gray-600 mb-4">{product.brands}</p>
      )}
      
      {/* Affichage du Nutriscore */}
      {product?.nutriscore_grade && (
        <Nutriscore grade={product.nutriscore_grade} />
      )}
      
      {/* Affichage du groupe NOVA */}
      {product?.nova_group && (
        <NovaGroup group={product.nova_group} />
      )}
      
      <div className="bg-white/80 rounded-lg shadow-sm p-4 mb-4">
        <h2 className="text-lg font-semibold mb-3">Information nutritionnelle</h2>
        <div className="space-y-2">
          <NutritionValue label="Énergie" value={product?.nutriments?.energy} unit="kJ" />
          <NutritionValue label="Matières grasses" value={product?.nutriments?.fat} />
          <NutritionValue label="dont acides gras saturés" value={product?.nutriments?.["saturated-fat"]} />
          <NutritionValue label="Glucides" value={product?.nutriments?.carbohydrates} />
          <NutritionValue label="dont sucres" value={product?.nutriments?.sugars} />
          <NutritionValue label="Fibres alimentaires" value={product?.nutriments?.fiber} />
          <NutritionValue label="Protéines" value={product?.nutriments?.proteins} />
          <NutritionValue label="Sel" value={product?.nutriments?.salt} />
        </div>
      </div>
      
      {product?.ingredients_text && (
        <div className="bg-white/80 rounded-lg shadow-sm p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">Ingrédients</h2>
          <p className="text-gray-700 text-sm">{product.ingredients_text}</p>
        </div>
      )}
      
      {product?.allergens && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <h2 className="text-lg font-semibold text-red-700 mb-2">Allergènes</h2>
          <p className="text-red-600">{product.allergens}</p>
        </div>
      )}
    </div>
  );
};

export default Product;
