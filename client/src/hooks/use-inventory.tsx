import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Product } from "@shared/schema";

let socket: Socket | null = null;

export function useInventory() {
  const [inventoryData, setInventoryData] = useState<Record<number, number>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!socket) {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}`;

      socket = io(wsUrl, {
        path: "/inventory-ws",
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
    }

    function onConnect() {
      setIsConnected(true);
      setError(null);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onError(err: Error) {
      setError(err);
      setIsLoading(false);
    }

    function onInitialInventory(products: Product[]) {
      const inventory: Record<number, number> = {};
      products.forEach((product) => {
        inventory[product.id] = product.stock;
      });
      setInventoryData(inventory);
      setIsLoading(false);
    }

    function onInventoryUpdate(update: { productId: number; stock: number }) {
      setInventoryData((prev) => ({
        ...prev,
        [update.productId]: update.stock,
      }));
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("error", onError);
    socket.on("inventory:initial", onInitialInventory);
    socket.on("inventory:updated", onInventoryUpdate);

    // Set a timeout to prevent indefinite loading state
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setError(new Error("Failed to load inventory data"));
      }
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
      if (socket) {
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
        socket.off("error", onError);
        socket.off("inventory:initial", onInitialInventory);
        socket.off("inventory:updated", onInventoryUpdate);
      }
    };
  }, []);

  return {
    inventoryData,
    isConnected,
    isLoading,
    error,
    getStockLevel: (productId: number, initialStock?: number) => {
      // During loading or error, fall back to initial stock
      if (isLoading || error) {
        return initialStock ?? 0;
      }
      // Otherwise use WebSocket data if available, falling back to initial stock
      return inventoryData[productId] ?? initialStock ?? 0;
    },
  };
}