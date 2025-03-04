import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { setupInventoryTracking } from "./inventory";
import { insertReviewSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  // Set up authentication routes
  setupAuth(app);

  // Protected API routes
  const requireAuth = (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  // Product routes (public)
  app.get("/api/products", async (_req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get("/api/products/:id", async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  });

  // Reviews routes
  app.get("/api/products/:id/reviews", async (req, res) => {
    try {
      const reviews = await storage.getProductReviews(Number(req.params.id));
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/products/:id/reviews", requireAuth, async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        userId: req.user!.id,
        productId: Number(req.params.id),
      });

      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      res.status(400).json({ message: "Invalid review data" });
    }
  });

  app.get("/api/products/category/:category", async (req, res) => {
    const products = await storage.getProductsByCategory(req.params.category);
    res.json(products);
  });

  // Order routes (protected)
  app.post("/api/orders", requireAuth, async (req, res) => {
    try {
      const order = await storage.createOrder({
        ...req.body,
        userId: req.user!.id,
      });
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: "Failed to create order" });
    }
  });

  app.get("/api/orders", requireAuth, async (req, res) => {
    try {
      const orders = await storage.getOrders();
      // Filter orders by user ID
      const userOrders = orders.filter(order => order.userId === req.user!.id);
      res.json(userOrders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", requireAuth, async (req, res) => {
    try {
      const order = await storage.getOrder(Number(req.params.id));
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      // Ensure user can only access their own orders
      if (order.userId !== req.user!.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.patch("/api/orders/:id/status", requireAuth, async (req, res) => {
    try {
      const { status } = req.body;
      const order = await storage.updateOrderStatus(Number(req.params.id), status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: "Failed to update order status" });
    }
  });

  const httpServer = createServer(app);

  // Set up WebSocket server for inventory tracking
  const io = setupInventoryTracking(httpServer);

  // Add new route for manual inventory updates (admin only)
  app.patch("/api/products/:id/stock", requireAuth, async (req, res) => {
    try {
      const productId = Number(req.params.id);
      const { stock } = req.body;

      const updatedProduct = await storage.updateProductStock(productId, stock);
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Broadcast the update via WebSocket
      io.emit("inventory:updated", {
        productId: updatedProduct.id,
        stock: updatedProduct.stock,
      });

      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: "Failed to update stock" });
    }
  });

  return httpServer;
}