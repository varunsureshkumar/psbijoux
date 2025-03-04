import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { setupInventoryTracking } from "./inventory";
import { insertReviewSchema } from "@shared/schema";
import { db } from "./db";
import { users, reviews, orders, orderItems, products } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

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
      const reviewsWithUsers = await db
        .select({
          id: reviews.id,
          userId: reviews.userId,
          productId: reviews.productId,
          rating: reviews.rating,
          comment: reviews.comment,
          createdAt: reviews.createdAt,
          userName: users.name,
        })
        .from(reviews)
        .innerJoin(users, eq(reviews.userId, users.id))
        .where(eq(reviews.productId, Number(req.params.id)))
        .orderBy(desc(reviews.createdAt));

      res.json(reviewsWithUsers);
    } catch (error) {
      console.error("Error fetching reviews:", error);
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
      // Get all orders for the logged-in user with detailed information
      const userOrders = await db
        .select({
          id: orders.id,
          status: orders.status,
          total: orders.total,
          createdAt: orders.createdAt,
        })
        .from(orders)
        .where(eq(orders.userId, req.user!.id))
        .orderBy(desc(orders.createdAt));

      res.json(userOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", requireAuth, async (req, res) => {
    try {
      // First check if order exists and belongs to user
      const order = await storage.getOrder(Number(req.params.id));
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      if (order.userId !== req.user!.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Get order items with product details
      const items = await db
        .select({
          id: orderItems.id,
          orderId: orderItems.orderId,
          productId: orderItems.productId,
          quantity: orderItems.quantity,
          price: orderItems.price,
          productName: products.name,
        })
        .from(orderItems)
        .innerJoin(products, eq(orderItems.productId, products.id))
        .where(eq(orderItems.orderId, order.id));

      // Combine order with items
      const orderWithItems = {
        ...order,
        items: items
      };

      res.json(orderWithItems);
    } catch (error) {
      console.error("Error fetching order:", error);
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