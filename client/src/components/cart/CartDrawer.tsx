import { ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import useCart from "@/lib/cart";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";

export function CartDrawer() {
  const { items, removeItem } = useCart();
  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const cartProducts = products?.filter((product) =>
    items.some((item) => item.productId === product.id)
  );

  const total = cartProducts?.reduce((acc, product) => {
    const quantity = items.find((item) => item.productId === product.id)?.quantity || 0;
    return acc + product.price * quantity;
  }, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingBag className="h-5 w-5" />
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
              {items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 pr-4">
          {cartProducts?.length ? (
            <div className="space-y-4">
              {cartProducts.map((product) => {
                const cartItem = items.find((item) => item.productId === product.id);
                return (
                  <div key={product.id} className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Qty: {cartItem?.quantity}
                      </p>
                      <p className="text-sm">${product.price.toLocaleString()}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(product.id)}
                    >
                      Remove
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          )}
        </ScrollArea>
        {total && total > 0 ? (
          <div className="border-t pt-4 space-y-4">
            <div className="flex justify-between text-lg font-medium">
              <span>Total</span>
              <span>${total.toLocaleString()}</span>
            </div>
            <Button className="w-full">Proceed to Checkout</Button>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
