import { useQuery } from "@tanstack/react-query";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Product } from "@shared/schema";

export default function Products() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      {products && <ProductGrid products={products} />}
    </div>
  );
}
