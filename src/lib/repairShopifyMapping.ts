import { storefrontApiRequest } from "./shopify";
import { RepairCartItem } from "@/stores/repairCartStore";
import { CartItem, ShopifyProduct } from "@/stores/cartStore";

// Extended type for repair products with SKU
interface RepairShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          sku: string | null;
          price: {
            amount: string;
            currencyCode: string;
          };
          availableForSale: boolean;
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
        };
      }>;
    };
    options: Array<{
      name: string;
      values: string[];
    }>;
  };
}

const REPAIR_PRODUCTS_QUERY = `
  query GetRepairProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                title
                sku
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
        }
      }
    }
  }
`;

// Cache for repair products to avoid repeated API calls
let repairProductsCache: Map<string, RepairShopifyProduct> | null = null;

export async function fetchRepairProducts(): Promise<Map<string, RepairShopifyProduct>> {
  if (repairProductsCache) {
    return repairProductsCache;
  }

  try {
    const data = await storefrontApiRequest(REPAIR_PRODUCTS_QUERY, {
      first: 100,
      query: 'product_type:"Repair Service"'
    });

    const products = data?.data?.products?.edges || [];
    const productMap = new Map<string, RepairShopifyProduct>();

    products.forEach((product: RepairShopifyProduct) => {
      const sku = product.node.variants?.edges?.[0]?.node?.sku;
      if (sku) {
        // Map SKU like "REP-ring-size-down" to id "ring-size-down"
        const repairId = sku.replace('REP-', '');
        productMap.set(repairId, product);
      }
    });

    repairProductsCache = productMap;
    return productMap;
  } catch (error) {
    console.error('Failed to fetch repair products:', error);
    return new Map();
  }
}

export async function convertRepairItemsToCartItems(
  repairItems: RepairCartItem[]
): Promise<CartItem[]> {
  const repairProducts = await fetchRepairProducts();
  const cartItems: CartItem[] = [];

  for (const repairItem of repairItems) {
    const repairProduct = repairProducts.get(repairItem.id);
    
    if (repairProduct) {
      const variant = repairProduct.node.variants?.edges?.[0]?.node;
      
      if (variant) {
        // Convert RepairShopifyProduct to ShopifyProduct format for CartItem
        const shopifyProduct: ShopifyProduct = {
          node: {
            id: repairProduct.node.id,
            title: repairProduct.node.title,
            description: repairProduct.node.description,
            handle: repairProduct.node.handle,
            priceRange: repairProduct.node.priceRange,
            images: repairProduct.node.images,
            variants: {
              edges: repairProduct.node.variants.edges.map(v => ({
                node: {
                  id: v.node.id,
                  title: v.node.title,
                  price: v.node.price,
                  availableForSale: v.node.availableForSale,
                  selectedOptions: v.node.selectedOptions
                }
              }))
            },
            options: repairProduct.node.options
          }
        };

        cartItems.push({
          product: shopifyProduct,
          variantId: variant.id,
          variantTitle: variant.title || 'Default Title',
          price: {
            amount: repairItem.price.toString(),
            currencyCode: variant.price?.currencyCode || 'USD'
          },
          quantity: repairItem.quantity,
          selectedOptions: variant.selectedOptions || []
        });
      }
    } else {
      console.warn(`No Shopify product found for repair item: ${repairItem.id}`);
    }
  }

  return cartItems;
}

// Clear cache (useful for testing or refresh)
export function clearRepairProductsCache() {
  repairProductsCache = null;
}
