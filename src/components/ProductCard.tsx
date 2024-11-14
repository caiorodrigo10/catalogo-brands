import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Product } from "@/types/product";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface ProductCardProps {
  product: Product;
  onRequestSample: (id: string) => void;
  onSelectProduct: (id: string) => void;
  projectId?: string;
  availablePoints?: number;
}

const ProductCard = ({ 
  product, 
  onRequestSample, 
  onSelectProduct,
  projectId,
  availablePoints = 0
}: ProductCardProps) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleRequestSample = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to request samples.",
      });
      return;
    }

    setIsLoading(true);
    try {
      await addItem(product);
      onRequestSample(product.id);
      toast({
        title: "Success",
        description: "Product added to cart successfully.",
      });
      navigate("/checkout/confirmation");
    } catch (error) {
      console.error('Error adding product to cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add product to cart. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = async () => {
    if (!projectId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No project selected. Please select a project first.",
      });
      return;
    }

    if (availablePoints < 1000) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Not enough points available.",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Add product to project and update points
      const { error: projectError } = await supabase
        .from('project_products')
        .insert({
          project_id: projectId,
          product_id: product.id,
        });

      if (projectError) throw projectError;

      // Update project points
      const { error: pointsError } = await supabase
        .from('projects')
        .update({ 
          points_used: availablePoints - 1000 
        })
        .eq('id', projectId);

      if (pointsError) throw pointsError;

      onSelectProduct(product.id);
      toast({
        title: "Success",
        description: "Product selected successfully. 1000 points used.",
      });
    } catch (error) {
      console.error('Error selecting product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to select product. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const profit = product.srp - product.from_price;

  return (
    <Card className="bg-white border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200">
      <div className="relative aspect-square bg-gray-50">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}
        {product.is_new && (
          <Badge className="absolute top-4 right-4 z-10 bg-primary">
            NEW
          </Badge>
        )}
        {product.is_tiktok && (
          <Badge className="absolute top-4 right-4 z-10 bg-pink-600">
            TIKTOK
          </Badge>
        )}
        <img
          src={imageError ? '/placeholder.svg' : (product.image_url || '/placeholder.svg')}
          alt={product.name}
          className={`w-full h-full object-cover p-4 transition-opacity duration-200 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={handleImageError}
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="text-sm text-gray-600 mb-2">{product.category}</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 min-h-[3.5rem] line-clamp-2">
          {product.name}
        </h3>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div>
            <p className="text-sm text-gray-600">From</p>
            <p className="font-semibold text-gray-900">${product.from_price.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">SRP</p>
            <p className="font-semibold text-gray-900">${product.srp.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Profit</p>
            <p className="font-semibold text-green-600">${profit.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            className="flex-1 text-primary hover:text-primary border-primary hover:bg-primary/10"
            onClick={handleRequestSample}
            disabled={isLoading}
          >
            {isLoading ? "Adding to cart..." : "Request Sample"}
          </Button>
          <Button 
            className="flex-1 bg-primary hover:bg-primary-dark text-white"
            onClick={handleSelect}
            disabled={isLoading || availablePoints < 1000}
          >
            Select (1000 pts)
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;