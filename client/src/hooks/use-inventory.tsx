import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Product } from "@shared/schema";

let socket: Socket | null = null;

export function useInventory() {
  const [inventoryData, setInventoryData] = useState<Record<number, number>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!socket) {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}`;

      socket = io(wsUrl, {
        path: "/inventory-ws",
      });
    }

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
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
    socket.on("inventory:initial", onInitialInventory);
    socket.on("inventory:updated", onInventoryUpdate);

    return () => {
      socket?.off("connect", onConnect);
      socket?.off("disconnect", onDisconnect);
      socket?.off("inventory:initial", onInitialInventory);
      socket?.off("inventory:updated", onInventoryUpdate);
    };
  }, []);

  return {
    inventoryData,
    isConnected,
    isLoading,
    getStockLevel: (productId: number, initialStock?: number) => {
      // Use WebSocket data if available, otherwise fall back to initial stock
      return inventoryData[productId] ?? initialStock ?? 0;
    },
  };
}