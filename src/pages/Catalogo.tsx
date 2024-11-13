import { useToast } from "@/components/ui/use-toast";
import CatalogLayout from "@/components/catalog/CatalogLayout";
import { useProducts } from "@/hooks/useProducts";

const Catalogo = () => {
  const { toast } = useToast();
  const { data: products, isLoading, error } = useProducts();

  if (error) {
    toast({
      variant: "destructive",
      title: "Erro ao carregar produtos",
      description: "Não foi possível carregar os produtos. Tente novamente mais tarde.",
    });
  }

  const handleRequestSample = (productId: string) => {
    toast({
      title: "Amostra Solicitada",
      description: "Sua solicitação de amostra foi registrada com sucesso.",
    });
  };

  const handleSelectProduct = (productId: string) => {
    toast({
      title: "Produto Selecionado",
      description: "Produto adicionado ao seu projeto.",
    });
  };

  return (
    <CatalogLayout
      products={products || []}
      isLoading={isLoading}
      onRequestSample={handleRequestSample}
      onSelectProduct={handleSelectProduct}
    />
  );
};

export default Catalogo;