import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Truck, Shield, Package, ChevronDown, Loader2, ShoppingCart } from "lucide-react";
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { useProduct, useRawProduct, useProducts } from "@/hooks/useShopifyProducts";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [shippingOpen, setShippingOpen] = useState(false);
  const addItem = useCartStore(state => state.addItem);

  // Fetch formatted product for display
  const { data: product, isLoading, error } = useProduct(handle || '');
  // Fetch raw product for cart operations
  const { data: rawProduct } = useRawProduct(handle || '');
  // Fetch all products for "You May Also Like"
  const { data: allProducts } = useProducts();

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

  // Filter related products (exclude current product)
  const relatedProducts = allProducts?.filter(
    (p: any) => p.node.handle !== handle
  ).slice(0, 4) || [];

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

  // Extract material from tags or use default
  const materialTag = product.tags.find((tag: string) => 
    tag.toLowerCase().includes('gold') || 
    tag.toLowerCase().includes('silver') || 
    tag.toLowerCase().includes('platinum')
  );
  const material = materialTag || '14k Gold';

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

      <main className="pt-24 pb-32 lg:pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <Link 
            to="/shop" 
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-16">
            {/* Product Images - 60% on desktop */}
            <div className="lg:col-span-3 space-y-4">
              {/* Main Image */}
              <div className="aspect-square overflow-hidden rounded-xl bg-secondary/20 shadow-lg border border-border/50">
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
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={cn(
                        "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                        selectedImageIndex === index
                          ? 'border-primary shadow-md'
                          : 'border-transparent hover:border-muted-foreground/30'
                      )}
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

            {/* Product Info - 40% on desktop */}
            <div className="lg:col-span-2 space-y-6">
              {/* Category Tag */}
              <span className="inline-block px-3 py-1 text-xs font-medium uppercase tracking-wider bg-secondary text-secondary-foreground rounded">
                {product.category === 'repairs' ? 'Repair Service' : product.productType || 'Fine Jewelry'}
              </span>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-serif leading-tight">
                {product.title}
              </h1>

              {/* Price - Larger and more prominent */}
              <p className="text-3xl md:text-4xl font-semibold text-primary">
                ${displayPrice.toFixed(2)}
                <span className="text-base font-normal text-muted-foreground ml-2">{product.currency}</span>
              </p>

              {/* Description - sanitized to prevent XSS */}
              <div className="py-4 border-t border-b border-border">
                {product.descriptionHtml ? (
                  <div 
                    className="prose prose-sm max-w-none text-muted-foreground [&>p]:text-muted-foreground"
                    dangerouslySetInnerHTML={{ 
                      __html: DOMPurify.sanitize(product.descriptionHtml, {
                        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3', 'span', 'div'],
                        ALLOWED_ATTR: ['href', 'target', 'rel', 'class']
                      })
                    }}
                  />
                ) : product.description ? (
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                ) : (
                  <p className="text-muted-foreground leading-relaxed">
                    A stunning piece crafted with care by our Diamond District artisans.
                  </p>
                )}
              </div>

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
                        className={cn(
                          "px-4 py-2 text-sm rounded-md border transition-colors",
                          selectedVariantIndex === index
                            ? 'border-primary bg-primary/10 text-foreground'
                            : variant.available
                            ? 'border-border hover:border-primary/50 text-foreground'
                            : 'border-border bg-muted text-muted-foreground cursor-not-allowed line-through'
                        )}
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

              {/* Add to Cart Button - Hidden on mobile (shown as sticky) */}
              <Button
                onClick={handleAddToCart}
                disabled={!isAvailable}
                size="lg"
                className="hidden lg:flex w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isAvailable
                  ? `Add to Cart — $${totalPrice.toFixed(2)}`
                  : 'Out of Stock'
                }
              </Button>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck className="h-4 w-4 text-primary" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="h-4 w-4 text-primary" />
                  <span>Fully Insured</span>
                </div>
              </div>

              {/* Accordion Sections */}
              <div className="space-y-0 border-t border-border pt-4">
                {/* Details Accordion */}
                <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-4 text-left border-b border-border hover:text-primary transition-colors">
                    <span className="font-medium">Details</span>
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform",
                      detailsOpen && "rotate-180"
                    )} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="py-4 space-y-2 text-sm text-muted-foreground">
                    <p>• Material: {material}</p>
                    <p>• Made in NYC's Diamond District</p>
                    <p>• Handcrafted by master jewelers</p>
                  </CollapsibleContent>
                </Collapsible>

                {/* Shipping & Returns Accordion */}
                <Collapsible open={shippingOpen} onOpenChange={setShippingOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-4 text-left border-b border-border hover:text-primary transition-colors">
                    <span className="font-medium">Shipping & Returns</span>
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform",
                      shippingOpen && "rotate-180"
                    )} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="py-4 space-y-2 text-sm text-muted-foreground">
                    <p>• Free shipping on all orders</p>
                    <p>• Ships within 1-2 business days</p>
                    <p>• 30-day returns accepted</p>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              {/* Artisan Note */}
              <div className="bg-secondary/50 rounded-lg p-6">
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

          {/* You May Also Like Section */}
          {relatedProducts.length > 0 && (
            <section className="mt-16 lg:mt-24 pt-12 border-t border-border">
              <h2 className="text-2xl md:text-3xl font-serif mb-8">You May Also Like</h2>
              
              {/* Mobile: Horizontal scroll, Desktop: Grid */}
              <div className="flex lg:grid lg:grid-cols-4 gap-6 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
                {relatedProducts.map((product: any) => {
                  const { node } = product;
                  const image = node.images.edges[0]?.node;
                  const price = node.priceRange.minVariantPrice;

                  return (
                    <Link
                      key={node.id}
                      to={`/product/${node.handle}`}
                      className="flex-shrink-0 w-64 lg:w-auto group"
                    >
                      <div className="aspect-square overflow-hidden rounded-lg bg-secondary/20 mb-4 border border-border/50">
                        {image && (
                          <img
                            src={image.url}
                            alt={image.altText || node.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                      </div>
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {node.title}
                      </h3>
                      <p className="text-primary font-semibold mt-1">
                        ${parseFloat(price.amount).toFixed(2)}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Mobile Sticky Add to Cart */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-background border-t border-border p-4 shadow-lg z-50">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-xl font-semibold text-primary">${totalPrice.toFixed(2)}</p>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={!isAvailable}
            size="lg"
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {isAvailable ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
