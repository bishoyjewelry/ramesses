import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCartStore, CartItem, ShopifyProduct } from "@/stores/cartStore";
import { toast } from "sonner";
import { Clock, Truck } from "lucide-react";

interface DesignOrderModalProps {
  design: {
    id: string;
    title: string;
    description: string | null;
    main_image_url: string;
    startingPrice: number;
    creator_profiles?: {
      display_name: string;
    };
  };
  isOpen: boolean;
  onClose: () => void;
}

const metalOptions = [
  { value: "14k-yellow", label: "14K Yellow Gold", priceAdd: 0 },
  { value: "14k-white", label: "14K White Gold", priceAdd: 0 },
  { value: "14k-rose", label: "14K Rose Gold", priceAdd: 0 },
  { value: "18k-yellow", label: "18K Yellow Gold", priceAdd: 300 },
  { value: "18k-white", label: "18K White Gold", priceAdd: 300 },
  { value: "18k-rose", label: "18K Rose Gold", priceAdd: 300 },
  { value: "platinum", label: "Platinum", priceAdd: 800 },
];

const ringSizes = [4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12];

export const DesignOrderModal = ({ design, isOpen, onClose }: DesignOrderModalProps) => {
  const [ringSize, setRingSize] = useState("");
  const [metal, setMetal] = useState("14k-yellow");
  const { addItem } = useCartStore();

  const selectedMetal = metalOptions.find((m) => m.value === metal);
  const finalPrice = design.startingPrice + (selectedMetal?.priceAdd || 0);

  const handleAddToCart = () => {
    if (!ringSize) {
      toast.error("Please select a ring size");
      return;
    }

    // Create a ShopifyProduct-compatible structure for gallery designs
    const mockProduct: ShopifyProduct = {
      node: {
        id: `design-gallery-${design.id}`,
        title: design.title,
        description: design.description || "",
        handle: `gallery-${design.id}`,
        priceRange: {
          minVariantPrice: {
            amount: finalPrice.toString(),
            currencyCode: "USD",
          },
        },
        images: {
          edges: [
            {
              node: {
                url: design.main_image_url,
                altText: design.title,
              },
            },
          ],
        },
        variants: {
          edges: [
            {
              node: {
                id: `design-variant-${design.id}-${metal}-${ringSize}`,
                title: `${selectedMetal?.label} / Size ${ringSize}`,
                price: {
                  amount: finalPrice.toString(),
                  currencyCode: "USD",
                },
                availableForSale: true,
                selectedOptions: [
                  { name: "Metal", value: selectedMetal?.label || "" },
                  { name: "Ring Size", value: ringSize },
                ],
              },
            },
          ],
        },
        options: [
          { name: "Metal", values: metalOptions.map((m) => m.label) },
          { name: "Ring Size", values: ringSizes.map((s) => s.toString()) },
        ],
      },
    };

    const cartItem: CartItem = {
      product: mockProduct,
      variantId: `design-variant-${design.id}-${metal}-${ringSize}-${Date.now()}`,
      variantTitle: `${selectedMetal?.label} / Size ${ringSize}`,
      price: {
        amount: finalPrice.toString(),
        currencyCode: "USD",
      },
      quantity: 1,
      selectedOptions: [
        { name: "Metal", value: selectedMetal?.label || "" },
        { name: "Ring Size", value: ringSize },
        { name: "Designer", value: design.creator_profiles?.display_name || "Ramesses" },
      ],
    };

    addItem(cartItem);
    toast.success("Added to cart!");
    onClose();
    
    // Reset form for next time
    setRingSize("");
    setMetal("14k-yellow");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Order: {design.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Design Preview */}
          <div className="aspect-square w-full max-w-[200px] mx-auto overflow-hidden rounded-sm bg-muted">
            <img
              src={design.main_image_url}
              alt={design.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Metal Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Metal Type</label>
            <Select value={metal} onValueChange={setMetal}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {metalOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                    {option.priceAdd > 0 && (
                      <span className="text-muted-foreground ml-2">
                        (+${option.priceAdd})
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ring Size */}
          <div>
            <label className="block text-sm font-medium mb-2">Ring Size</label>
            <Select value={ringSize} onValueChange={setRingSize}>
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {ringSizes.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Not sure? We offer free resizing within 30 days.
            </p>
          </div>

          {/* Price */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total</span>
              <span className="text-xl font-semibold text-primary">
                ${finalPrice.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Ready in ~1 week
              </span>
              <span className="flex items-center gap-1">
                <Truck className="w-3 h-3" />
                Free shipping
              </span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            className="w-full bg-primary text-primary-foreground hover:bg-[hsl(var(--color-gold-hover))] py-6"
          >
            Add to Cart
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
