import {ProductContainer} from "@module/products/ProductContainer";
import {ProductDetail} from "@module/products/ProductDetail";
import React, {useState} from "react";

export function Products() {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );

  const handleProductClick = (id: string) => {
    setSelectedProductId(id);
  };

  const handleBackToBlog = () => {
    setSelectedProductId(null);
  };

  if (selectedProductId) {
    return <ProductDetail id={selectedProductId} onBack={handleBackToBlog} />;
  }

  return <ProductContainer onProductClick={handleProductClick} />;
}
