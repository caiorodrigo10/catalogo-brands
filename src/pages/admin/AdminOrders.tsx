import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import AdminOrdersTable from "@/components/admin/orders/AdminOrdersTable";
import { Skeleton } from "@/components/ui/skeleton";
import OrderStatusFilters from "@/components/sample-orders/OrderStatusFilters";

const ITEMS_PER_PAGE = 15;

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showOnHold, setShowOnHold] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["admin-orders", selectedStatus, currentPage],
    queryFn: async () => {
      let query = supabase
        .from("sample_requests")
        .select(`
          *,
          products: sample_request_products (
            product:products (
              id,
              name,
              image_url,
              from_price
            )
          ),
          customer:profiles (
            id,
            first_name,
            last_name,
            email
          )
        `, { count: 'exact' });

      if (selectedStatus !== "all") {
        query = query.eq('status', selectedStatus);
      }

      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      return {
        data,
        totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE),
        currentPage
      };
    },
  });

  const filteredOrders = ordersData?.data?.filter(order => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const customerName = `${order.customer?.first_name} ${order.customer?.last_name}`.toLowerCase();
    const orderId = `SPL${order.id.slice(0, 6)}`.toLowerCase();
    const customerEmail = order.customer?.email?.toLowerCase() || '';
    
    return customerName.includes(searchLower) || 
           orderId.includes(searchLower) ||
           customerEmail.includes(searchLower);
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Orders Management</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all customer sample orders
        </p>
      </div>

      <div className="space-y-4">
        <OrderStatusFilters
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          showOnHold={showOnHold}
          setShowOnHold={setShowOnHold}
        />

        <div className="flex justify-between items-center">
          <Input
            placeholder="Search by customer name, email or order number..."
            className="max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <AdminOrdersTable orders={filteredOrders || []} />
    </div>
  );
};

export default AdminOrders;