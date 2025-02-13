import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <div className="relative">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80")', // Luxury jewelry display with diamonds and rings
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative container mx-auto px-4 py-32 sm:px-6 lg:flex lg:items-center lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Timeless Elegance
          </h1>
          <p className="mt-4 text-xl text-white">
            Discover our collection of exquisite fine jewelry
          </p>
          <div className="mt-8 flex justify-center gap-x-4">
            <Button asChild size="lg" className="bg-white text-black hover:bg-gray-100">
              <Link href="/products">Shop Collection</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}