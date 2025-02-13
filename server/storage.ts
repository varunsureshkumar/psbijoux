import { type Product, type InsertProduct } from "@shared/schema";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;

  constructor() {
    this.products = new Map();
    this.initializeProducts();
  }

  private initializeProducts() {
    const sampleProducts: Product[] = [
      {
        id: 1,
        name: "Diamond Solitaire Ring",
        description: "Classic 1 carat diamond ring in 18k white gold",
        category: "Rings",
        price: 4999.99,
        image: "https://images.unsplash.com/photo-1638517747460-4d9e114ab3e7",
        images: [
          "https://images.unsplash.com/photo-1638517747460-4d9e114ab3e7",
          "https://images.unsplash.com/photo-1638517747421-a1eb8b4c9828",
        ],
      },
      {
        id: 2,
        name: "Pearl Necklace",
        description: "Elegant South Sea pearl necklace",
        category: "Necklaces",
        price: 2999.99,
        image: "https://images.unsplash.com/photo-1531995811006-35cb42e1a022",
        images: [
          "https://images.unsplash.com/photo-1531995811006-35cb42e1a022",
          "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516",
        ],
      },
      // Add more sample products as needed
    ];

    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.category === category
    );
  }
}

export const storage = new MemStorage();
