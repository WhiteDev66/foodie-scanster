
import React from "react";
import { ThumbsUp, AlertTriangle, AlertCircle } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

interface HealthAssessmentProps {
  product: any;
}

const HealthAssessment = ({ product }: HealthAssessmentProps) => {
  const { t } = useLanguage();
  if (!product) return null;
  
  const nutriscoreGrade = product.nutriscore_grade?.toUpperCase();
  const novaGroup = product.nova_group ? (typeof product.nova_group === 'string' ? parseInt(product.nova_group, 10) : product.nova_group) : null;
  const sugarContent = product.nutriments?.sugars;
  const saltContent = product.nutriments?.salt;
  const fatContent = product.nutriments?.fat;
  const saturatedFatContent = product.nutriments?.["saturated-fat"];
  
  // Déterminer si le produit est sain ou non
  const isHealthy = (
    (nutriscoreGrade === 'A' || nutriscoreGrade === 'B') && 
    (novaGroup === 1 || novaGroup === 2)
  );
  
  const isUnhealthy = (
    (nutriscoreGrade === 'D' || nutriscoreGrade === 'E') || 
    novaGroup === 4
  );
  
  // Déterminer les risques potentiels pour la santé
  const healthRisks = [];
  
  if (sugarContent && sugarContent > 10) {
    healthRisks.push(t("risk_diabetes"));
  }
  
  if (saltContent && saltContent > 1.5) {
    healthRisks.push(t("risk_hypertension"));
  }
  
  if (fatContent && fatContent > 15) {
    healthRisks.push(t("risk_cardiovascular"));
  }
  
  if (saturatedFatContent && saturatedFatContent > 5) {
    healthRisks.push(t("risk_heart"));
  }
  
  if (novaGroup === 4) {
    healthRisks.push(t("risk_processed"));
  }
  
  return (
    <div className="bg-white/80 rounded-lg shadow-sm p-4 mb-4">
      <h2 className="text-lg font-semibold mb-3">{t("health_assessment")}</h2>
      
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
            ? t("health_good") 
            : isUnhealthy 
              ? t("health_bad") 
              : t("health_moderate")}
        </span>
      </div>
      
      {healthRisks.length > 0 && (
        <div>
          <h3 className="text-md font-medium mb-2 text-red-700">{t("health_risks")}:</h3>
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

export default HealthAssessment;
