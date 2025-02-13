import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/products" component={Products} />
          <Route path="/product/:id" component={ProductDetail} />
          <Route path="/category/:category" component={Products} />
          <Route path="/contact" component={Contact} />
          <Route path="/about" component={() => <div className="container py-12"><h1>About Us</h1></div>} />
          <Route path="/shipping" component={() => <div className="container py-12"><h1>Shipping Information</h1></div>} />
          <Route path="/returns" component={() => <div className="container py-12"><h1>Returns Policy</h1></div>} />
          <Route path="/privacy" component={() => <div className="container py-12"><h1>Privacy Policy</h1></div>} />
          <Route path="/terms" component={() => <div className="container py-12"><h1>Terms of Service</h1></div>} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;