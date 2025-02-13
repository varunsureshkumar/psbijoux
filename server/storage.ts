import { type Product, type Order, type InsertOrder } from "@shared/schema";

export interface IStorage {
  // Product methods
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;

  // Order methods
  createOrder(order: InsertOrder): Promise<Order>;
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
}

// Temporary in-memory storage implementation
export class MemStorage implements IStorage {
  private products: Product[] = [
    {
      id: 1,
      name: "Diamond Solitaire Ring",
      description: "Classic 1-carat diamond solitaire in 18k white gold",
      category: "Rings",
      price: 4999.99,
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e",
      images: [
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e"
      ],
      stock: 10,
      createdAt: new Date()
    },
    {
      id: 2,
      name: "Pearl Necklace",
      description: "Elegant South Sea pearl strand with 18k gold clasp",
      category: "Necklaces",
      price: 2999.99,
      image: "https://images.unsplash.com/photo-1616019642975-0c9eb6b3c3b7",
      images: [
        "https://images.unsplash.com/photo-1616019642975-0c9eb6b3c3b7",
        "https://images.unsplash.com/photo-1616019642975-0c9eb6b3c3b7"
      ],
      stock: 5,
      createdAt: new Date()
    },
    {
      id: 3,
      name: "Diamond Tennis Bracelet",
      description: "Beautiful 3ct diamond tennis bracelet in platinum",
      category: "Bracelets",
      price: 7999.99,
      image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1",
      images: [
        "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1",
        "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1"
      ],
      stock: 3,
      createdAt: new Date()
    }
  ];

  private orders: Order[] = [];
  private orderIdCounter = 1;

  async getProducts(): Promise<Product[]> {
    return this.products;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.find(p => p.id === id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const newOrder: Order = {
      ...order,
      id: this.orderIdCounter++,
      createdAt: new Date(),
    };
    this.orders.push(newOrder);
    return newOrder;
  }

  async getOrders(): Promise<Order[]> {
    return this.orders;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.find(o => o.id === id);
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = await this.getOrder(id);
    if (order) {
      order.status = status;
      return order;
    }
    return undefined;
  }
}

export const storage = new MemStorage();