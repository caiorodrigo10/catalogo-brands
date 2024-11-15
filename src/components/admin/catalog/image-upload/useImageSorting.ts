import { useCallback } from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProductImage } from "@/types/product";

export const useImageSorting = (images: ProductImage[], onImagesUpdate: () => void) => {
  const { toast } = useToast();

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;

    const oldIndex = images.findIndex(img => img.id === active.id);
    const newIndex = images.findIndex(img => img.id === over.id);

    const reorderedImages = [...images];
    const [movedImage] = reorderedImages.splice(oldIndex, 1);
    reorderedImages.splice(newIndex, 0, movedImage);

    try {
      // Update positions and set first image as primary
      const updates = reorderedImages.map((img, index) => ({
        id: img.id,
        product_id: img.product_id,
        image_url: img.image_url,
        position: index,
        is_primary: index === 0 // First image is always primary
      }));

      await supabase
        .from('product_images')
        .upsert(updates);

      // Update the product's main image_url with the first image
      if (reorderedImages.length > 0) {
        await supabase
          .from('products')
          .update({ image_url: reorderedImages[0].image_url })
          .eq('id', reorderedImages[0].product_id);
      }

      onImagesUpdate();
    } catch (error) {
      console.error('Error reordering images:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reorder images",
      });
    }
  }, [images, onImagesUpdate, toast]);

  return { handleDragEnd };
};