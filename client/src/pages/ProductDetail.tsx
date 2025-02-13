import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useState } from "react";
import useCart from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${params?.id}`],
  });

  const { addItem } = useCart();

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="animate-pulse">
          <div className="h-96 bg-muted rounded-lg mb-8" />
          <div className="h-8 bg-muted rounded w-1/3 mb-4" />
          <div className="h-4 bg-muted rounded w-1/4 mb-8" />
          <div className="h-24 bg-muted rounded mb-8" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-12">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({ productId: product.id, quantity });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="container py-12">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <Carousel className="w-full">
            <CarouselContent>
              {product.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-square overflow-hidden rounded-lg">
                    <img
                      src={image}
                      alt={`${product.name} - View ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl mb-6">${product.price.toLocaleString()}</p>
          <p className="text-muted-foreground mb-6">{product.description}</p>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label htmlFor="quantity" className="font-medium">
                Quantity:
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="rounded-md border px-2 py-1"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <Button onClick={handleAddToCart} className="w-full">
              Add to Cart
            </Button>
          </div>

          <div className="mt-8 border-t pt-8">
            <h2 className="font-semibold mb-4">Product Details</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Category: {product.category}</li>
              <li>Free shipping on orders over $1000</li>
              <li>30-day return policy</li>
              <li>Certificate of authenticity included</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
