import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { AppLayout } from "./AppLayout";
import Login from "@/pages/Login";
import Index from "@/pages/Index";
import Profile from "@/pages/Profile";
import Projects from "@/pages/Projects";
import ProjectDetails from "@/pages/ProjectDetails";
import Catalog from "@/pages/Catalog";
import Products from "@/pages/Products";
import ProductDetails from "@/pages/ProductDetails";
import ProductSelectedSuccess from "@/pages/products/ProductSelectedSuccess";
import Documents from "@/pages/Documents";
import SampleOrders from "@/pages/SampleOrders";
import Checkout from "@/pages/checkout/Checkout";
import Success from "@/pages/checkout/Success";
import ProfitCalculator from "@/pages/ProfitCalculator";
import Error404 from "@/pages/Error404";

export const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Index />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Profile />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    
    <Route
      path="/projects"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Projects />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    
    <Route
      path="/projects/:id"
      element={
        <ProtectedRoute>
          <AppLayout>
            <ProjectDetails />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    
    <Route
      path="/catalog"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Catalog />
          </AppLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/catalog/:id"
      element={
        <ProtectedRoute>
          <AppLayout>
            <ProductDetails />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    
    <Route
      path="/products"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Products />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    
    <Route
      path="/products/:id"
      element={
        <ProtectedRoute>
          <AppLayout>
            <ProductDetails />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    
    <Route
      path="/products/success"
      element={
        <ProtectedRoute>
          <AppLayout>
            <ProductSelectedSuccess />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    
    <Route
      path="/documents"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Documents />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    
    <Route
      path="/sample-orders"
      element={
        <ProtectedRoute>
          <AppLayout>
            <SampleOrders />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    
    <Route
      path="/profit-calculator"
      element={
        <ProtectedRoute>
          <AppLayout>
            <ProfitCalculator />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    
    <Route
      path="/checkout/*"
      element={
        <ProtectedRoute>
          <Checkout />
        </ProtectedRoute>
      }
    />
    
    <Route
      path="/checkout/success"
      element={
        <ProtectedRoute>
          <Success />
        </ProtectedRoute>
      }
    />
    
    <Route
      path="*"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Error404 />
          </AppLayout>
        </ProtectedRoute>
      }
    />
  </Routes>
);