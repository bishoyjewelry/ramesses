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
const CreatorDashboard = React.lazy(() => import("./pages/CreatorDashboard"));
const MyRepairs = React.lazy(() => import("./pages/MyRepairs"));
const Auth = React.lazy(() => import("./pages/Auth"));
const Account = React.lazy(() => import("./pages/Account"));
const AdminDataExplorer = React.lazy(() => import("./pages/AdminDataExplorer"));
const AdminUsers = React.lazy(() => import("./pages/AdminUsers"));

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
            <Route path="/admin/data" element={<Suspense fallback={<PageLoader />}><AdminDataExplorer /></Suspense>} />
            <Route path="/admin/users" element={<Suspense fallback={<PageLoader />}><AdminUsers /></Suspense>} />
            <Route path="/auth" element={<Suspense fallback={<PageLoader />}><Auth /></Suspense>} />
            <Route path="/creator" element={<Suspense fallback={<PageLoader />}><CreatorDashboard /></Suspense>} />
            <Route path="/my-repairs" element={<Suspense fallback={<PageLoader />}><MyRepairs /></Suspense>} />
            <Route path="/account" element={<Suspense fallback={<PageLoader />}><Account /></Suspense>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
