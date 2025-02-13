import { Server } from "socket.io";
import type { Server as HTTPServer } from "http";
import { storage } from "./storage";
import { Product } from "@shared/schema";

export function setupInventoryTracking(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    path: "/inventory-ws",
    cors: {
      origin: "*",
    },
  });

  // Track connected clients
  const connectedClients = new Set<string>();

  io.on("connection", (socket) => {
    connectedClients.add(socket.id);
    console.log(`Client connected: ${socket.id}`);

    // Send initial inventory data
    storage.getProducts().then((products) => {
      socket.emit("inventory:initial", products);
    });

    // Handle stock updates
    socket.on("inventory:update", async (data: { productId: number; stock: number }) => {
      try {
        const product = await storage.updateProductStock(data.productId, data.stock);
        if (product) {
          // Broadcast the update to all connected clients
          io.emit("inventory:updated", {
            productId: product.id,
            stock: product.stock,
          });
        }
      } catch (error) {
        console.error("Error updating inventory:", error);
        socket.emit("inventory:error", "Failed to update inventory");
      }
    });

    socket.on("disconnect", () => {
      connectedClients.delete(socket.id);
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

// Helper function to broadcast inventory updates
export function broadcastInventoryUpdate(io: Server, product: Product) {
  io.emit("inventory:updated", {
    productId: product.id,
    stock: product.stock,
  });
}
