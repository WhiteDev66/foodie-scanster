
import React from "react";

interface NovaGroupProps {
  group: string | number | undefined | null;
}

const NovaGroup = ({ group }: NovaGroupProps) => {
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

export default NovaGroup;
