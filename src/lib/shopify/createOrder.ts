import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface CreateOrderParams {
  orderId: string;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
  shippingAddress: {
    address1: string;
    address2?: string;
    city: string;
    province: string;
    zip: string;
    phone: string;
  };
  lineItems: Array<{
    variant_id: string;
    quantity: number;
    price: number;
  }>;
}

export async function createShopifyOrder({
  orderId,
  customer,
  shippingAddress,
  lineItems
}: CreateOrderParams) {
  try {
    // Filter out any line items that don't have a valid Shopify variant ID
    const validLineItems = lineItems.filter(item => item.variant_id);

    if (validLineItems.length === 0) {
      throw new Error("No valid Shopify variants found for the products in the order");
    }

    const { data, error } = await supabase.functions.invoke('shopify-create-order', {
      body: {
        orderData: {
          orderId,
          customer,
          shipping_address: {
            ...shippingAddress,
            first_name: customer.first_name,
            last_name: customer.last_name,
            country: "US"
          },
          billing_address: {
            ...shippingAddress,
            first_name: customer.first_name,
            last_name: customer.last_name,
            country: "US"
          },
          line_items: validLineItems,
          financial_status: "paid"
        }
      }
    });

    if (error) throw error;

    // Update the sample request with the Shopify order ID
    if (data?.shopifyOrder?.id) {
      await supabase
        .from('sample_requests')
        .update({ shopify_order_id: data.shopifyOrder.id })
        .eq('id', orderId);
    }

    toast({
      title: "Order created in Shopify",
      description: `Order #${data.shopifyOrder.order_number} was created successfully.`
    });

    return data.shopifyOrder;

  } catch (error) {
    console.error('Error creating Shopify order:', error);
    toast({
      variant: "destructive",
      title: "Error creating order",
      description: "There was a problem creating your order in Shopify. Please try again."
    });
    throw error;
  }
}