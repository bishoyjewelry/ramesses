import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getProducts } from "@/lib/shopify";
import { ShopifyProduct, useCartStore } from "@/stores/cartStore";
import { Loader2, ShoppingCart, Package } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const Shop = () => {
  const { t } = useLanguage();
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
      <div className="min-h-screen bg-luxury-bg">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-12 w-12 animate-spin text-luxury-champagne" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-bg">
      <Navigation />
      
      {/* Hero - Luxury Palette */}
      <section className="pt-32 pb-16 bg-luxury-bg">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-serif luxury-heading text-luxury-text mb-6">
            {t('shop.title')}
          </h1>
          <p className="text-xl text-luxury-text-muted max-w-2xl mx-auto font-body">
            {t('shop.subtitle')}
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-luxury-bg-warm">
        <div className="container mx-auto px-4">
          {/* Mail-In Note */}
          <Card className="max-w-2xl mx-auto mb-12 border-luxury-champagne/20 bg-luxury-champagne/10 rounded-xl">
            <CardContent className="p-6 flex items-center gap-4">
              <Package className="w-8 h-8 text-luxury-champagne flex-shrink-0" />
              <p className="text-luxury-text font-body">
                {t('shop.mailin.note')}
              </p>
            </CardContent>
          </Card>

          {products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-luxury-text-muted mb-6 font-body">{t('shop.empty')}</p>
              <p className="text-luxury-text-muted font-body">Our collection is being updated. Please check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => {
                const { node } = product;
                const image = node.images.edges[0]?.node;
                const price = node.priceRange.minVariantPrice;
                
                return (
                  <Card key={node.id} className="border-luxury-divider hover:border-luxury-champagne/40 transition-all hover:shadow-luxury group rounded-xl overflow-hidden">
                    <Link to={`/product/${node.handle}`}>
                      <div className="aspect-square overflow-hidden bg-luxury-bg">
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
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-luxury-champagne transition-colors text-luxury-text">
                          {node.title}
                        </h3>
                      </Link>
                      <p className="text-2xl font-bold text-luxury-champagne mb-4">
                        {price.currencyCode} ${parseFloat(price.amount).toFixed(2)}
                      </p>
                      <Button 
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover font-semibold rounded-lg"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {t('shop.addToCart')}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Shop;