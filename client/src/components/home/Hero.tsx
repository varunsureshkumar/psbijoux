import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <div className="relative">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1601121141461-9d6647bca1ed")', // Updated to jewelry image
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative container mx-auto px-4 py-32 sm:px-6 lg:flex lg:items-center lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Timeless Elegance
          </h1>
          <p className="mt-4 text-xl text-white">
            Discover our collection of fine jewelry
          </p>
          <div className="mt-8 flex justify-center gap-x-4">
            <Button asChild size="lg" variant="default">
              <Link href="/products">Shop Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}