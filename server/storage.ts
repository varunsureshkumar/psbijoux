import { type Product, type InsertProduct } from "@shared/schema";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
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

  async getProducts(): Promise<Product[]> {
    return this.products;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.find(p => p.id === id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
}

export const storage = new MemStorage();