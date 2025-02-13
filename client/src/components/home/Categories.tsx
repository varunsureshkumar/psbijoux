import { Link } from "wouter";
import { categories } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";

export function Categories() {
  return (
    <section className="py-12">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link key={category} href={`/category/${category.toLowerCase()}`}>
              <a>
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={`https://images.unsplash.com/photo-${index + 1}`}
                        alt={category}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <h3 className="text-xl font-semibold text-white">
                          {category}
                        </h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
