import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProducts } from "@/lib/shopify";
import { ShopifyProduct, useCartStore } from "@/stores/cartStore";
import { Loader2, ShoppingCart, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const ProductDetail = () => {
  const { handle } = useParams();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const products = await getProducts();
        const foundProduct = products.find((p: ShopifyProduct) => p.node.handle === handle);
        setProduct(foundProduct || null);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [handle]);

  const handleAddToCart = () => {
    if (!product) return;
    
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

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-32">
          <p className="text-center text-xl">Product not found</p>
          <div className="text-center mt-6">
            <Link to="/shop">
              <Button variant="outline" className="border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-dark">
                Back to Shop
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { node } = product;
  const images = node.images.edges;
  const price = node.priceRange.minVariantPrice;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <Link to="/shop" className="inline-flex items-center text-luxury-gold hover:text-luxury-gold-light mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-luxury-cream">
                {images[selectedImage] && (
                  <img
                    src={images[selectedImage].node.url}
                    alt={images[selectedImage].node.altText || node.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-md overflow-hidden border-2 ${
                        selectedImage === index ? 'border-luxury-gold' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image.node.url}
                        alt={image.node.altText || node.title}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h1 className="text-4xl font-serif font-bold mb-4">{node.title}</h1>
              <p className="text-3xl font-bold text-luxury-gold mb-6">
                {price.currencyCode} ${parseFloat(price.amount).toFixed(2)}
              </p>
              
              {node.description && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">Description</h2>
                  <p className="text-muted-foreground leading-relaxed">{node.description}</p>
                </div>
              )}

              <Button 
                onClick={handleAddToCart}
                className="w-full bg-luxury-gold text-luxury-dark hover:bg-luxury-gold-light font-semibold py-6 text-lg"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
