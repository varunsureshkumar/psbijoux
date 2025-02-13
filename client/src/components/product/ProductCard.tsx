import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@shared/schema";
import { useInventory } from "@/hooks/use-inventory";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { getStockLevel } = useInventory();
  const stockLevel = getStockLevel(product.id);

  function getStockBadgeVariant(stock: number) {
    if (stock === 0) return "destructive";
    if (stock <= 5) return "warning";
    return "default";
  }

  return (
    <Link href={`/product/${product.id}`}>
      <a className="group block">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-square overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start p-4">
            <div className="flex w-full items-center justify-between">
              <h3 className="font-medium">{product.name}</h3>
              <Badge variant={getStockBadgeVariant(stockLevel)}>
                {stockLevel === 0 ? "Out of Stock" : `${stockLevel} in stock`}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              ${product.price.toLocaleString()}
            </p>
          </CardFooter>
        </Card>
      </a>
    </Link>
  );
}