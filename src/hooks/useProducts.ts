import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { useSearchParams } from "react-router-dom";

interface UseProductsOptions {
  page?: number;
  limit?: number;
  infinite?: boolean;
}

interface ProductsResponse {
  data: Product[];
  totalPages: number;
  totalCount: number;
  nextPage: number;
  hasMore: boolean;
}

export const useProducts = ({ page = 1, limit = 9, infinite = false }: UseProductsOptions = {}) => {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search");

  const fetchProducts = async (context: { pageParam?: number }) => {
    const currentPage = context.pageParam ?? page;
    const from = (currentPage - 1) * limit;
    const to = from + limit - 1;

    let query = supabase.from("products").select("*", { count: "exact" });

    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }

    const { count } = await query.select("*", { count: "exact", head: true });

    let dataQuery = supabase
      .from("products")
      .select("*");

    if (searchTerm) {
      dataQuery = dataQuery.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }

    const { data, error } = await dataQuery
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return {
      data: data as Product[],
      totalPages: Math.ceil((count || 0) / limit),
      totalCount: count || 0,
      nextPage: currentPage + 1,
      hasMore: from + limit < (count || 0),
    };
  };

  if (infinite) {
    return useInfiniteQuery<ProductsResponse>({
      queryKey: ["products", "infinite", { limit, search: searchTerm }],
      queryFn: fetchProducts,
      getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextPage : undefined,
      initialPageParam: 1,
    });
  }

  return useQuery<ProductsResponse>({
    queryKey: ["products", { page, limit, search: searchTerm }],
    queryFn: () => fetchProducts({ pageParam: page }),
  });
};