import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ScrollToTop from "@/components/ScrollToTop";
import MetaPixelPageView from "@/components/MetaPixelPageView";

import Index from "./pages/Index";
import Category from "./pages/Category";
import Catalog from "./pages/Catalog";
import Product from "./pages/Product";

import About from "./pages/About";
import Contact from "./pages/Contact";
import Faq from "./pages/Faq";

import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import ShippingPolicy from "./pages/ShippingPolicy";
import ReturnPolicy from "./pages/ReturnPolicy";

import NotFound from "./pages/NotFound";

import MaisVendidos from "./pages/MaisVendidos";
import Ofertas from "./pages/Ofertas";
import Favoritos from "./pages/Favoritos";

import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";

import { ProtectedRoute } from "./components/admin/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>

      <Toaster />
      <Sonner />

      <BrowserRouter>

        <ScrollToTop />
        <MetaPixelPageView />

        <Routes>

          {/* Público */}

          <Route path="/" element={<Index />} />

          <Route path="/catalogo" element={<Catalog />} />

          <Route
            path="/categoria/:category"
            element={<Category />}
          />

          <Route
            path="/categoria/:category/:subcategory"
            element={<Category />}
          />

          <Route
            path="/produto/:id"
            element={<Product />}
          />

          <Route
            path="/mais-vendidos"
            element={<MaisVendidos />}
          />

          <Route
            path="/ofertas"
            element={<Ofertas />}
          />

          <Route
            path="/favoritos"
            element={<Favoritos />}
          />

          <Route
            path="/sobre"
            element={<About />}
          />

          <Route
            path="/contato"
            element={<Contact />}
          />

          <Route
            path="/faq"
            element={<Faq />}
          />

          <Route
            path="/privacidade"
            element={<PrivacyPolicy />}
          />

          <Route
            path="/termos"
            element={<TermsOfUse />}
          />

          <Route
            path="/entrega"
            element={<ShippingPolicy />}
          />

          <Route
            path="/devolucoes"
            element={<ReturnPolicy />}
          />

          {/* Administração */}

          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/produtos"
            element={
              <ProtectedRoute>
                <AdminProducts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/produtos/:id/editar"
            element={
              <ProtectedRoute>
                <AdminProducts />
              </ProtectedRoute>
            }
          />

          {/* 404 */}

          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>

      </BrowserRouter>

    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);