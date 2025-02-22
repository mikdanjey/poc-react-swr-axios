import { useState } from "react";

import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";

export default function App() {
  const [editingProduct, setEditingProduct] = useState(null);

  return (
    <div className="container mx-auto p-4">
      <ProductForm
        product={editingProduct}
        onSuccess={() => setEditingProduct(null)}
      />
      <ProductList onEdit={setEditingProduct} />
    </div>
  );
}
