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
        timeout: 10000,
      });
    }

    function onConnect() {
      console.log("WebSocket connected");
      setIsConnected(true);
      setError(null);
      // Request initial inventory data after connection
      socket?.emit("inventory:request");
    }

    function onDisconnect() {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    }

    function onConnectError(err: Error) {
      console.error("WebSocket connection error:", err);
      setError(new Error("Failed to connect to inventory service"));
      setIsLoading(false);
    }

    function onInitialInventory(products: Product[]) {
      console.log("Received initial inventory:", products);
      const inventory: Record<number, number> = {};
      products.forEach((product) => {
        inventory[product.id] = product.stock;
      });
      setInventoryData(inventory);
      setIsLoading(false);
      setError(null);
    }

    function onInventoryUpdate(update: { productId: number; stock: number }) {
      console.log("Received inventory update:", update);
      setInventoryData((prev) => ({
        ...prev,
        [update.productId]: update.stock,
      }));
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("inventory:initial", onInitialInventory);
    socket.on("inventory:updated", onInventoryUpdate);

    // Set a timeout to prevent indefinite loading state
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.log("Inventory loading timeout reached");
        setIsLoading(false);
        // Instead of showing error immediately, try to reconnect
        if (!isConnected) {
          socket?.connect();
        }
      }
    }, 10000); // Increased timeout to 10 seconds

    return () => {
      clearTimeout(timeoutId);
      if (socket) {
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
        socket.off("connect_error", onConnectError);
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
      // During loading, use initial stock
      if (isLoading) {
        return initialStock ?? 0;
      }
      // If there's an error but we have initial stock, use that
      if (error && initialStock !== undefined) {
        return initialStock;
      }
      // Otherwise use WebSocket data if available, falling back to initial stock
      return inventoryData[productId] ?? initialStock ?? 0;
    },
  };
}