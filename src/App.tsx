// App entry point - v3 with lazy loading
import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Lazy load pages with heavy Radix UI dependencies
const Repairs = React.lazy(() => import("./pages/Repairs"));
const Custom = React.lazy(() => import("./pages/Custom"));
const Admin = React.lazy(() => import("./pages/Admin"));

// Simple loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-pulse text-primary">Loading...</div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/repairs" element={<Suspense fallback={<PageLoader />}><Repairs /></Suspense>} />
            <Route path="/custom" element={<Suspense fallback={<PageLoader />}><Custom /></Suspense>} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:handle" element={<ProductDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Suspense fallback={<PageLoader />}><Admin /></Suspense>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
