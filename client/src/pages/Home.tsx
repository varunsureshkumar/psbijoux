import { Hero } from "@/components/home/Hero";
import { Categories } from "@/components/home/Categories";
import { ProductGrid } from "@/components/product/ProductGrid";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";

export default function Home() {
  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  return (
    <div>
      <Hero />
      <Categories />
      <section className="py-12">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-8">
            Featured Products
          </h2>
          {products && <ProductGrid products={products.slice(0, 8)} />}
        </div>
      </section>
    </div>
  );
}
