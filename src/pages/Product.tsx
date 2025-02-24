
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "../services/api";

const Product = () => {
  const { barcode } = useParams();
  
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", barcode],
    queryFn: () => getProduct(barcode || ""),
    enabled: !!barcode,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">Chargement...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Produit non trouvé</h1>
          <p className="text-gray-600">
            Désolé, nous n'avons pas trouvé le produit recherché.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.product_name}
                  className="w-full h-64 object-contain rounded-lg"
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">Pas d'image disponible</span>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-semibold mb-4">{product.product_name}</h1>
              
              {product.nutriscore_grade && (
                <div className="mb-4">
                  <h2 className="text-lg font-medium mb-2">Nutriscore</h2>
                  <div className="inline-block px-3 py-1 rounded bg-brand-100 text-brand-800">
                    {product.nutriscore_grade.toUpperCase()}
                  </div>
                </div>
              )}

              {product.ingredients_text && (
                <div className="mb-4">
                  <h2 className="text-lg font-medium mb-2">Ingrédients</h2>
                  <p className="text-gray-600">{product.ingredients_text}</p>
                </div>
              )}

              {product.labels_tags && product.labels_tags.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-lg font-medium mb-2">Labels</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.labels_tags.map((label) => (
                      <span
                        key={label}
                        className="px-2 py-1 rounded-full bg-brand-50 text-brand-600 text-sm"
                      >
                        {label.replace("en:", "")}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
