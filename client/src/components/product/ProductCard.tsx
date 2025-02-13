import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
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
            <h3 className="font-medium">{product.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              ${product.price.toLocaleString()}
            </p>
          </CardFooter>
        </Card>
      </a>
    </Link>
  );
}
