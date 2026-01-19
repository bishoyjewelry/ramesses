import { useQuery } from '@tanstack/react-query';
import { getProducts, getProductByHandle, formatProduct, FormattedProduct } from '@/lib/shopify';
import { ShopifyProduct } from '@/stores/cartStore';

export function useProducts() {
  return useQuery({
    queryKey: ['shopify-products'],
    queryFn: () => getProducts(50),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useProduct(handle: string) {
  return useQuery<FormattedProduct | null>({
    queryKey: ['shopify-product', handle],
    queryFn: async () => {
      const product = await getProductByHandle(handle);
      return product ? formatProduct(product) : null;
    },
    enabled: !!handle,
    staleTime: 5 * 60 * 1000,
  });
}

// Helper to get raw ShopifyProduct format for cart operations
export function useRawProduct(handle: string) {
  return useQuery<ShopifyProduct | null>({
    queryKey: ['shopify-product-raw', handle],
    queryFn: async () => {
      const product = await getProductByHandle(handle);
      if (!product) return null;
      // Return in the ShopifyProduct format expected by cart store
      return { node: product };
    },
    enabled: !!handle,
    staleTime: 5 * 60 * 1000,
  });
}
