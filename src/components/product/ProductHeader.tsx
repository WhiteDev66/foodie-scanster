
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";

interface ProductHeaderProps {
  product: any;
}

const ProductHeader = ({ product }: ProductHeaderProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <>
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
            alt={product.product_name || t("unknown_product")}
            className="rounded-lg shadow-md max-h-64 object-contain"
          />
        </div>
      )}
      
      <h1 className="text-2xl font-bold mb-2">{product?.product_name || t("unknown_product")}</h1>
      
      {product?.brands && (
        <p className="text-gray-600 mb-4">{product.brands}</p>
      )}
    </>
  );
};

export default ProductHeader;
