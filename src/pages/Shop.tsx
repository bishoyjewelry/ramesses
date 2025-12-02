import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getProducts } from "@/lib/shopify";
import { ShopifyProduct, useCartStore } from "@/stores/cartStore";
import { Loader2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Shop = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: ShopifyProduct) => {
    const variant = product.node.variants.edges[0].node;
    const cartItem = {
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || []
    };
    
    addItem(cartItem);
    toast.success("Added to cart", {
      description: product.node.title,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-12 w-12 animate-spin text-luxury-gold" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-32 pb-16 bg-luxury-dark text-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
            Our <span className="text-luxury-gold">Jewelry Collection</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our curated selection of fine gold and silver jewelry
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-6">No products found</p>
              <p className="text-muted-foreground">Our collection is being updated. Please check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => {
                const { node } = product;
                const image = node.images.edges[0]?.node;
                const price = node.priceRange.minVariantPrice;
                
                return (
                  <Card key={node.id} className="border-luxury-gold/20 hover:border-luxury-gold/40 transition-all hover:shadow-xl group">
                    <Link to={`/product/${node.handle}`}>
                      <div className="aspect-square overflow-hidden bg-luxury-cream">
                        {image && (
                          <img
                            src={image.url}
                            alt={image.altText || node.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        )}
                      </div>
                    </Link>
                    <CardContent className="p-6">
                      <Link to={`/product/${node.handle}`}>
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-luxury-gold transition-colors">
                          {node.title}
                        </h3>
                      </Link>
                      <p className="text-2xl font-bold text-luxury-gold mb-4">
                        {price.currencyCode} ${parseFloat(price.amount).toFixed(2)}
                      </p>
                      <Button 
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-luxury-gold text-luxury-dark hover:bg-luxury-gold-light font-semibold"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Shop;
