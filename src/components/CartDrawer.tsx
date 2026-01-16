import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart, Minus, Plus, Trash2, ExternalLink, Loader2, Wrench } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useRepairCartStore } from "@/stores/repairCartStore";
import { createStorefrontCheckout } from "@/lib/shopify";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface CartDrawerProps {
  isScrolled?: boolean;
}

export const CartDrawer = ({ isScrolled = true }: CartDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { 
    items: shopifyItems, 
    isLoading, 
    updateQuantity: updateShopifyQuantity, 
    removeItem: removeShopifyItem, 
    setLoading,
    setCheckoutUrl
  } = useCartStore();
  
  const {
    items: repairItems,
    updateQuantity: updateRepairQuantity,
    removeItem: removeRepairItem,
    getSubtotal: getRepairSubtotal,
    getDiscountedTotal: getRepairDiscountedTotal,
    hasBulkDiscount,
    getTotalItems: getRepairTotalItems,
  } = useRepairCartStore();
  
  const shopifyTotalItems = shopifyItems.reduce((sum, item) => sum + item.quantity, 0);
  const repairTotalItems = getRepairTotalItems();
  const totalItems = shopifyTotalItems + repairTotalItems;
  
  const shopifyTotalPrice = shopifyItems.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);
  const repairSubtotal = getRepairSubtotal();
  const repairDiscountedTotal = getRepairDiscountedTotal();
  const hasRepairDiscount = hasBulkDiscount();
  
  // Combined total price
  const totalPrice = shopifyTotalPrice + repairDiscountedTotal;

  const handleCheckout = async () => {
    if (shopifyItems.length === 0) return;
    
    setLoading(true);
    try {
      const checkoutUrl = await createStorefrontCheckout(shopifyItems);
      setCheckoutUrl(checkoutUrl);
      window.open(checkoutUrl, '_blank');
      setIsOpen(false);
    } catch (error) {
      console.error('Checkout failed:', error);
      toast.error("Failed to create checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRepairCheckout = () => {
    setIsOpen(false);
    navigate('/cart');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Open shopping cart">
          <ShoppingCart className={`h-5 w-5 ${isScrolled ? 'text-foreground' : 'text-white'}`} />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle>{t('cart.title')}</SheetTitle>
          <SheetDescription>
            {totalItems === 0 ? t('cart.empty') : `${totalItems} item${totalItems !== 1 ? 's' : ''}`}
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-col flex-1 pt-6 min-h-0">
          {totalItems === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t('cart.empty')}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                <div className="space-y-4">
                  {/* Repair Services Section */}
                  {repairItems.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
                        <Wrench className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Repair Services</span>
                        {hasRepairDiscount && (
                          <span className="text-xs bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full ml-auto">
                            20% bulk discount
                          </span>
                        )}
                      </div>
                      {repairItems.map((item) => (
                        <div key={item.id} className="flex gap-4 p-2 border-b border-border">
                          <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
                            <Wrench className="h-6 w-6 text-muted-foreground" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate text-sm">{item.name}</h4>
                            <p className="text-xs text-muted-foreground">{item.turnaroundDays} days</p>
                            <p className="font-semibold text-sm mt-1 text-primary">
                              ${item.price}
                            </p>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => removeRepairItem(item.id)}
                              aria-label={`Remove ${item.name} from cart`}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                            
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => updateRepairQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => updateRepairQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Shopify Products Section */}
                  {shopifyItems.length > 0 && (
                    <div>
                      {repairItems.length > 0 && (
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
                          <ShoppingCart className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Products</span>
                        </div>
                      )}
                      {shopifyItems.map((item) => (
                        <div key={item.variantId} className="flex gap-4 p-2 border-b border-border">
                          <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                            {item.product.node.images?.edges?.[0]?.node && (
                              <img
                                src={item.product.node.images.edges[0].node.url}
                                alt={item.product.node.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate text-sm">{item.product.node.title}</h4>
                            {item.variantTitle !== 'Default Title' && (
                              <p className="text-xs text-muted-foreground">{item.variantTitle}</p>
                            )}
                            <p className="font-semibold text-sm mt-1 text-primary">
                              ${parseFloat(item.price.amount).toFixed(2)}
                            </p>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => removeShopifyItem(item.variantId)}
                              aria-label={`Remove ${item.product.node.title} from cart`}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                            
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => updateShopifyQuantity(item.variantId, item.quantity - 1)}
                                aria-label={`Decrease quantity of ${item.product.node.title}`}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => updateShopifyQuantity(item.variantId, item.quantity + 1)}
                                aria-label={`Increase quantity of ${item.product.node.title}`}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-shrink-0 space-y-4 pt-4 border-t border-border bg-background">
                {/* Repair Services Total */}
                {repairItems.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Repair Services</span>
                      {hasRepairDiscount ? (
                        <div className="flex items-center gap-2">
                          <span className="line-through text-muted-foreground">${repairSubtotal}</span>
                          <span className="font-semibold text-primary">${repairDiscountedTotal}</span>
                        </div>
                      ) : (
                        <span className="font-semibold">${repairSubtotal}</span>
                      )}
                    </div>
                    <Button 
                      onClick={handleRepairCheckout}
                      variant="outline"
                      className="w-full" 
                      size="sm"
                    >
                      <Wrench className="w-4 h-4 mr-2" />
                      Continue with Repairs
                    </Button>
                  </div>
                )}

                {/* Shopify Products Total */}
                {shopifyItems.length > 0 && (
                  <div className="space-y-2">
                    {repairItems.length > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Products</span>
                        <span className="font-semibold">${shopifyTotalPrice.toFixed(2)}</span>
                      </div>
                    )}
                    <Button 
                      onClick={handleCheckout}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90" 
                      size="lg"
                      disabled={shopifyItems.length === 0 || isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t('cart.creating')}
                        </>
                      ) : (
                        <>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          {t('cart.checkout')} (${shopifyTotalPrice.toFixed(2)})
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Show combined total only when both types exist */}
                {repairItems.length > 0 && shopifyItems.length > 0 && (
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="text-lg font-semibold">{t('cart.total')}</span>
                    <span className="text-xl font-bold text-primary">${totalPrice.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
