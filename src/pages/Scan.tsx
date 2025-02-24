
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Scan = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-2xl font-semibold mb-4">Scanner un produit</h1>
        <p className="text-gray-600">
          Fonctionnalité de scan à venir dans la prochaine mise à jour...
        </p>
      </div>
    </div>
  );
};

export default Scan;
