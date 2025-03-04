import { Product } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "wouter";

interface RecommendationSidebarProps {
  currentProduct: Product;
  allProducts: Product[];
}

export function RecommendationSidebar({ currentProduct, allProducts }: RecommendationSidebarProps) {
  // Get recommendations from the same category, excluding current product
  const recommendations = allProducts
    .filter(
      (product) =>
        product.category === currentProduct.category &&
        product.id !== currentProduct.id
    )
    .slice(0, 4); // Show top 4 recommendations

  return (
    <div className="w-full lg:w-64">
      <h3 className="text-lg font-semibold mb-4">You May Also Like</h3>
      <ScrollArea className="h-[500px]">
        <div className="space-y-4">
          {recommendations.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <Card className="cursor-pointer hover:bg-accent transition-colors">
                <CardContent className="p-3">
                  <div className="aspect-square overflow-hidden rounded-md mb-2">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h4 className="font-medium line-clamp-2">{product.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    ${product.price.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
