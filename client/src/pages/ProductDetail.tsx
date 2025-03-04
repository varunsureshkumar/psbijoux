import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import useCart from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import { useInventory } from "@/hooks/use-inventory";
import { Plus, Minus } from "lucide-react";
import { RecommendationSidebar } from "@/components/product/RecommendationSidebar";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const { getStockLevel } = useInventory();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${params?.id}`],
  });

  const { data: allProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { addItem } = useCart();

  if (isLoading || !allProducts) {
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

  const currentStock = getStockLevel(product.id, product.stock);

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= currentStock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    const added = addItem({ productId: product.id, quantity }, currentStock);

    if (added) {
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    } else {
      toast({
        title: "Cannot add to cart",
        description: `Sorry, there isn't enough stock available.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-2xl mb-6">${product.price.toLocaleString()}</p>
              <p className="text-muted-foreground mb-6">{product.description}</p>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="font-medium">Quantity:</label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1 || currentStock === 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= currentStock || currentStock === 0}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button 
                  onClick={handleAddToCart} 
                  className="w-full"
                  disabled={currentStock === 0}
                >
                  {currentStock === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
              </div>

              <div className="mt-8 border-t pt-8">
                <h2 className="font-semibold mb-4">Product Details</h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Category: {product.category}</li>
                  <li>Stock: {currentStock} available</li>
                  <li>Free shipping on orders over $1000</li>
                  <li>30-day return policy</li>
                  <li>Certificate of authenticity included</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Add recommendation sidebar */}
        <RecommendationSidebar currentProduct={product} allProducts={allProducts} />
      </div>
    </div>
  );
}