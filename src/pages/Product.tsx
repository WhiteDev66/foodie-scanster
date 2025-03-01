
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
