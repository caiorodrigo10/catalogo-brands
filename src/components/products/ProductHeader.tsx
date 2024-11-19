import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Product } from "@/types/product";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductActions } from "./ProductActions";
import { ProductBenefits } from "./ProductBenefits";
import { ProductCalculator } from "./ProductCalculator";

interface ProductHeaderProps {
  product: Product;
  onSelectProduct: () => void;
}

export const ProductHeader = ({ product, onSelectProduct }: ProductHeaderProps) => {
  const [selectedImage, setSelectedImage] = useState<string>(product.image_url || "/placeholder.svg");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: productImages } = useQuery({
    queryKey: ['product-images', product.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', product.id)
        .order('position');

      if (error) throw error;
      
      // Filter out any images that don't exist in our media library
      const validImages = data?.filter(img => img.image_url?.startsWith('https://'));
      
      // If we have a primary image, set it as selected
      const primaryImage = validImages?.find(img => img.is_primary)?.image_url;
      if (primaryImage) {
        setSelectedImage(primaryImage);
      }
      
      return validImages || [];
    },
  });

  const handleThumbnailClick = (imageUrl: string, index: number) => {
    setSelectedImage(imageUrl);
    setCurrentImageIndex(index);
  };

  // Create an array of unique images, including the main product image if it exists
  const uniqueImages = [
    ...(product.image_url ? [{ image_url: product.image_url, position: -1 }] : []),
    ...(productImages || [])
  ].filter((img, index, self) => 
    index === self.findIndex((t) => t.image_url === img.image_url)
  );

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => {
      const newIndex = prev === 0 ? uniqueImages.length - 1 : prev - 1;
      setSelectedImage(uniqueImages[newIndex].image_url);
      return newIndex;
    });
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => {
      const newIndex = prev === uniqueImages.length - 1 ? 0 : prev + 1;
      setSelectedImage(uniqueImages[newIndex].image_url);
      return newIndex;
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      <div className="space-y-6">
        <div className="relative bg-white rounded-lg overflow-hidden">
          {product.is_new && (
            <Badge className="absolute top-4 left-4 bg-primary">NEW</Badge>
          )}
          {product.is_tiktok && (
            <Badge className="absolute top-4 right-4 bg-pink-600">SELL ON TIKTOK</Badge>
          )}
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full aspect-square object-contain p-4 cursor-zoom-in"
            onClick={() => setLightboxOpen(true)}
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = '/placeholder.svg';
            }}
          />
        </div>
        {uniqueImages.length > 1 && (
          <div className="grid grid-cols-4 gap-4">
            {uniqueImages.map((image, index) => (
              <button
                key={`${image.image_url}-${index}`}
                onClick={() => handleThumbnailClick(image.image_url, index)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  selectedImage === image.image_url 
                    ? 'border-primary' 
                    : 'border-transparent hover:border-primary/50'
                }`}
              >
                <img
                  src={image.image_url}
                  alt={`${product.name} - View ${index + 1}`}
                  className="w-full h-full object-contain p-2 bg-white"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = '/placeholder.svg';
                  }}
                />
              </button>
            ))}
          </div>
        )}

        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent className="max-w-[90vw] h-[90vh] p-0">
            <div className="relative w-full h-full flex items-center justify-center bg-black/95">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white hover:bg-white/20"
                onClick={() => setLightboxOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                onClick={handlePreviousImage}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>

              <img
                src={selectedImage}
                alt={product.name}
                className="max-h-full max-w-full object-contain p-4"
              />

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                onClick={handleNextImage}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-xl text-gray-600">Ships exclusively to US</p>
          <p className="text-gray-700 text-lg">{product.description}</p>
        </div>
        <div className="text-4xl font-bold mb-4">
          ${product.from_price.toFixed(2)}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-lg">
            <span>Sell more, pay less!</span>
            <Button variant="link" className="text-primary">
              View Volume Discounts
            </Button>
          </div>

          <div className="flex items-center justify-between text-lg">
            <span>Large business?</span>
            <Button variant="link" className="text-primary">
              Unlock Special Pricing
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200">
            <div>
              <p className="text-gray-600">Shipping cost</p>
              <p className="text-lg">From ${(4.50).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-600">SRP</p>
              <p className="text-lg">${product.srp.toFixed(2)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-600">Potential profit</p>
              <p className="text-lg text-green-600 font-semibold">
                ${(product.srp - product.from_price).toFixed(2)}
              </p>
            </div>
          </div>

          <ProductActions 
            product={product}
            onSelectProduct={onSelectProduct}
          />
        </div>
      </div>
    </div>
  );
};