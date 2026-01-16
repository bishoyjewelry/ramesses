import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Minus, 
  Plus, 
  Trash2, 
  Wrench, 
  ShoppingBag,
  MapPin,
  Mail,
  ExternalLink,
  Loader2,
  Tag
} from "lucide-react";
import { useCartStore, CartItem as ShopifyCartItem } from "@/stores/cartStore";
import { useRepairCartStore, RepairCartItem } from "@/stores/repairCartStore";
import { createStorefrontCheckout } from "@/lib/shopify";
import { toast } from "sonner";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
}

const Cart = () => {
  const navigate = useNavigate();
  
  // Shopify cart
  const shopifyItems = useCartStore((state) => state.items);
  const updateShopifyQuantity = useCartStore((state) => state.updateQuantity);
  const removeShopifyItem = useCartStore((state) => state.removeItem);
  const clearShopifyCart = useCartStore((state) => state.clearCart);
  
  // Repair cart
  const repairItems = useRepairCartStore((state) => state.items);
  const updateRepairQuantity = useRepairCartStore((state) => state.updateQuantity);
  const removeRepairItem = useRepairCartStore((state) => state.removeItem);
  const clearRepairCart = useRepairCartStore((state) => state.clearCart);
  const repairSubtotal = useRepairCartStore((state) => state.getSubtotal());
  const repairDiscountedTotal = useRepairCartStore((state) => state.getDiscountedTotal());
  const hasBulkDiscount = useRepairCartStore((state) => state.hasBulkDiscount());
  
  // Form state
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
  });
  const [fulfillmentMethod, setFulfillmentMethod] = useState<"dropoff" | "mailin">("dropoff");
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Calculate totals
  const shopifyTotal = shopifyItems.reduce(
    (sum, item) => sum + parseFloat(item.price.amount) * item.quantity,
    0
  );
  const grandTotal = shopifyTotal + repairDiscountedTotal;
  const hasItems = shopifyItems.length > 0 || repairItems.length > 0;

  const handleCheckout = async () => {
    // Validate customer info
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast.error("Please fill in all customer information");
      return;
    }

    if (fulfillmentMethod === "mailin" && (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zip)) {
      toast.error("Please fill in your shipping address for mail-in service");
      return;
    }

    setIsLoading(true);

    try {
      // Prepare cart items for Shopify checkout
      const allItems: ShopifyCartItem[] = [...shopifyItems];
      
      // Note: Repair services are now in Shopify, but we need to look them up by SKU
      // For now, we'll use the existing Shopify cart items and handle repairs separately
      
      if (allItems.length > 0) {
        const checkoutUrl = await createStorefrontCheckout(allItems);
        
        // Clear carts after successful checkout initiation
        clearShopifyCart();
        
        // Open checkout in new tab
        window.open(checkoutUrl, '_blank');
        toast.success("Redirecting to checkout...");
      }
      
      // Handle repair items separately if only repairs in cart
      if (repairItems.length > 0 && shopifyItems.length === 0) {
        // For repair-only orders, redirect to contact/quote flow
        toast.info("Repair orders require a quote. Redirecting to contact form...");
        navigate("/contact");
        clearRepairCart();
      }
      
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to initiate checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Your Cart</h1>
            <p className="text-muted-foreground">
              {hasItems
                ? `${shopifyItems.length + repairItems.length} item(s) in your cart`
                : "Your cart is empty"}
            </p>
          </div>
        </div>

        {!hasItems ? (
          <Card className="text-center py-16">
            <CardContent>
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Browse our repair services or shop to add items.
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link to="/repairs">Browse Repairs</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/shop">Shop Products</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Repair Services Section */}
              {repairItems.length > 0 && (
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Wrench className="h-5 w-5 text-primary" />
                        Repair Services
                      </CardTitle>
                      {hasBulkDiscount && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <Tag className="h-3 w-3 mr-1" />
                          20% Bulk Discount
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {repairItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground truncate">
                            {item.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Turnaround: {item.turnaroundDays} days
                          </p>
                          <p className="text-sm font-medium text-primary mt-1">
                            ${item.price} each
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateRepairQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateRepairQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => removeRepairItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-muted-foreground">Repairs Subtotal</span>
                      <div className="text-right">
                        {hasBulkDiscount && (
                          <span className="text-sm text-muted-foreground line-through mr-2">
                            ${repairSubtotal.toFixed(2)}
                          </span>
                        )}
                        <span className="font-semibold text-lg">
                          ${repairDiscountedTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Shop Products Section */}
              {shopifyItems.length > 0 && (
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                      Shop Products
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {shopifyItems.map((item) => (
                      <div
                        key={item.variantId}
                        className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg"
                      >
                        {/* Product Image */}
                        <div className="w-20 h-20 bg-secondary/20 rounded-md overflow-hidden flex-shrink-0">
                          {item.product.node.images?.edges?.[0]?.node && (
                            <img
                              src={item.product.node.images.edges[0].node.url}
                              alt={item.product.node.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground truncate">
                            {item.product.node.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {item.selectedOptions.map((opt) => opt.value).join(" • ")}
                          </p>
                          <p className="text-sm font-medium text-primary mt-1">
                            {item.price.currencyCode} {parseFloat(item.price.amount).toFixed(2)} each
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateShopifyQuantity(item.variantId, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateShopifyQuantity(item.variantId, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold">
                            {item.price.currencyCode} {(parseFloat(item.price.amount) * item.quantity).toFixed(2)}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => removeShopifyItem(item.variantId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-muted-foreground">Products Subtotal</span>
                      <span className="font-semibold text-lg">
                        ${shopifyTotal.toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary & Checkout */}
            <div className="space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={customerInfo.name}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={customerInfo.email}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={customerInfo.phone}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, phone: e.target.value })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Fulfillment Method (for repairs) */}
              {repairItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Fulfillment Method</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup
                      value={fulfillmentMethod}
                      onValueChange={(value: "dropoff" | "mailin") =>
                        setFulfillmentMethod(value)
                      }
                    >
                      <div className="flex items-start space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="dropoff" id="dropoff" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="dropoff" className="font-medium cursor-pointer">
                            <MapPin className="h-4 w-4 inline mr-2" />
                            Drop-off
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Visit our store at 123 Jewelry Lane, NYC
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="mailin" id="mailin" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="mailin" className="font-medium cursor-pointer">
                            <Mail className="h-4 w-4 inline mr-2" />
                            Mail-in
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            We'll send you a prepaid shipping label
                          </p>
                        </div>
                      </div>
                    </RadioGroup>

                    {fulfillmentMethod === "mailin" && (
                      <div className="space-y-4 pt-4 border-t">
                        <div className="space-y-2">
                          <Label htmlFor="street">Street Address *</Label>
                          <Input
                            id="street"
                            placeholder="123 Main St"
                            value={shippingAddress.street}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                street: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City *</Label>
                            <Input
                              id="city"
                              placeholder="New York"
                              value={shippingAddress.city}
                              onChange={(e) =>
                                setShippingAddress({
                                  ...shippingAddress,
                                  city: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">State *</Label>
                            <Input
                              id="state"
                              placeholder="NY"
                              value={shippingAddress.state}
                              onChange={(e) =>
                                setShippingAddress({
                                  ...shippingAddress,
                                  state: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zip">ZIP Code *</Label>
                          <Input
                            id="zip"
                            placeholder="10001"
                            value={shippingAddress.zip}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                zip: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {repairItems.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Repairs</span>
                      <div className="text-right">
                        {hasBulkDiscount && (
                          <span className="text-sm text-muted-foreground line-through mr-2">
                            ${repairSubtotal.toFixed(2)}
                          </span>
                        )}
                        <span>${repairDiscountedTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                  
                  {shopifyItems.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Products</span>
                      <span>${shopifyTotal.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">${grandTotal.toFixed(2)}</span>
                  </div>
                  
                  <Button
                    className="w-full mt-4"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    ) : (
                      <ExternalLink className="h-5 w-5 mr-2" />
                    )}
                    {isLoading ? "Processing..." : "Proceed to Checkout"}
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground">
                    You'll be redirected to our secure checkout
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
