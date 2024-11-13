import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { useAuth } from "./contexts/AuthContext";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Perfil from "./pages/Perfil";
import Projetos from "./pages/Projetos";
import Catalogo from "./pages/Catalogo";
import Produtos from "./pages/Produtos";
import Documentos from "./pages/Documentos";
import PedidoAmostra from "./pages/PedidoAmostra";
import Envio from "./pages/Envio";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default stale time of 24 hours
      staleTime: 1000 * 60 * 60 * 24,
      // Don't refetch on window focus by default
      refetchOnWindowFocus: false,
      // Don't refetch on mount if we have data
      refetchOnMount: false,
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  return <>{children}</>;
};

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen bg-background">
    <Sidebar />
    <main className="flex-1 ml-64 p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </main>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <TooltipProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Index />
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/perfil" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Perfil />
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/projetos" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Projetos />
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/catalogo" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Catalogo />
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/produtos" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Produtos />
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/documentos" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Documentos />
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/pedido-amostra" element={
                <ProtectedRoute>
                  <AppLayout>
                    <PedidoAmostra />
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/envio" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Envio />
                  </AppLayout>
                </ProtectedRoute>
              } />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;