import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Truck, Shield, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { useProduct, useRawProduct } from "@/hooks/useShopifyProducts";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const addItem = useCartStore(state => state.addItem);

  // Fetch formatted product for display
  const { data: product, isLoading, error } = useProduct(handle || '');
  // Fetch raw product for cart operations
  const { data: rawProduct } = useRawProduct(handle || '');

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(10, prev + delta)));
  };

  const handleAddToCart = () => {
    if (!product || !rawProduct) return;

    const variant = product.variants[selectedVariantIndex];
    if (!variant) return;

    const cartItem = {
      product: rawProduct,
      variantId: variant.id,
      variantTitle: variant.title,
      price: { amount: String(variant.price), currencyCode: variant.currency },
      quantity: quantity,
      selectedOptions: variant.options || []
    };

    addItem(cartItem);
    toast.success("Added to cart", {
      description: `${quantity} × ${product.title}`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-32 pb-16 text-center">
          <h1 className="text-3xl mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/shop">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Shop
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const selectedVariant = product.variants[selectedVariantIndex];
  const isAvailable = selectedVariant?.available !== false;
  const displayPrice = selectedVariant?.price || product.price;
  const totalPrice = displayPrice * quantity;

  return (
    <div className="min-h-screen bg-background">
      {/* Free Shipping Banner */}
      <div className="bg-primary/10 py-2">
        <div className="container mx-auto px-4 flex items-center justify-center gap-2 text-sm">
          <Truck className="h-4 w-4 text-primary" />
          <span className="text-foreground">Free Shipping & Free Returns on All Orders</span>
        </div>
      </div>

      <Navigation />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <Link 
            to="/shop" 
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square overflow-hidden rounded-lg bg-secondary/20">
                {product.images[selectedImageIndex] && (
                  <img
                    src={product.images[selectedImageIndex].url}
                    alt={product.images[selectedImageIndex].alt}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImageIndex === index
                          ? 'border-primary'
                          : 'border-transparent hover:border-muted-foreground/30'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Category Tag */}
              <span className="inline-block px-3 py-1 text-xs font-medium uppercase tracking-wider bg-secondary text-secondary-foreground rounded">
                {product.category === 'repairs' ? 'Repair Service' : product.productType || 'Fine Jewelry'}
              </span>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-serif">
                {product.title}
              </h1>

              {/* Price */}
              <p className="text-2xl md:text-3xl font-semibold text-primary">
                {product.currency} ${displayPrice.toFixed(2)}
              </p>

              {/* Description */}
              {product.descriptionHtml ? (
                <div 
                  className="prose prose-sm max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                />
              ) : product.description ? (
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              ) : (
                <p className="text-muted-foreground leading-relaxed">
                  A beautiful piece handcrafted by our master jewelers in NYC's Diamond District.
                </p>
              )}

              {/* Variant Selector */}
              {product.variants.length > 1 && (
                <div className="space-y-3">
                  <label className="text-sm font-medium">Options</label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant, index) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariantIndex(index)}
                        disabled={!variant.available}
                        className={`px-4 py-2 text-sm rounded-md border transition-colors ${
                          selectedVariantIndex === index
                            ? 'border-primary bg-primary/10 text-foreground'
                            : variant.available
                            ? 'border-border hover:border-primary/50 text-foreground'
                            : 'border-border bg-muted text-muted-foreground cursor-not-allowed line-through'
                        }`}
                      >
                        {variant.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10}
                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={!isAvailable}
                size="lg"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg"
              >
                {isAvailable
                  ? `Add to Cart — $${totalPrice.toFixed(2)}`
                  : 'Out of Stock'
                }
              </Button>

              {/* Trust Badges */}
              <div className="space-y-4 pt-6 border-t border-border">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Free Shipping</p>
                    <p className="text-xs text-muted-foreground">On all orders</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Secure Checkout</p>
                    <p className="text-xs text-muted-foreground">Encrypted payment processing</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Expert Craftsmanship</p>
                    <p className="text-xs text-muted-foreground">Since 1985</p>
                  </div>
                </div>
              </div>

              {/* Artisan Note */}
              <div className="bg-secondary/50 rounded-lg p-6 mt-6">
                <p className="text-sm italic text-muted-foreground leading-relaxed">
                  "Each piece is handcrafted with care by master jewelers in NYC's Diamond District,
                  ensuring exceptional quality and attention to detail."
                </p>
                <p className="text-sm font-medium mt-3 text-foreground">
                  — Ramses, Master Jeweler
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
