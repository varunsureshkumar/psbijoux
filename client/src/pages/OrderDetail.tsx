import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Order } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

interface OrderWithItems extends Order {
  items: {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
    productName: string;
  }[];
}

export default function OrderDetail() {
  const [, params] = useRoute("/orders/:id");

  const { data: order, isLoading } = useQuery<OrderWithItems>({
    queryKey: [`/api/orders/${params?.id}`],
  });

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-12">
        <h1 className="text-2xl font-bold mb-4">Order not found</h1>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Order #{order.id}</h1>
          <p className="text-muted-foreground">
            Placed on {format(new Date(order.createdAt), "MMMM d, yyyy")}
          </p>
        </div>
        <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <h3 className="font-medium">{item.productName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">${item.price.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <span>Subtotal</span>
                  <span className="font-medium">
                    ${order.total.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <span>Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${order.total.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function getStatusVariant(status: string): "default" | "destructive" | "secondary" | "outline" {
  switch (status.toLowerCase()) {
    case "pending":
      return "default";
    case "processing":
      return "secondary";
    case "completed":
      return "outline";
    case "cancelled":
      return "destructive";
    default:
      return "default";
  }
}