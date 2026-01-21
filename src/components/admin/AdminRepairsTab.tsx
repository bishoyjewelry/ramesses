import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { validateImageFiles } from "@/lib/fileValidation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRepairStatusUpdate } from "@/hooks/useRepairStatusUpdate";
import { 
  Loader2, 
  Eye, 
  RefreshCw, 
  Mail, 
  Truck, 
  Search, 
  ArrowUpDown,
  Upload,
  Pencil,
  X,
  Image as ImageIcon,
  StickyNote,
  Package,
  MapPin,
  Building,
  CreditCard,
  CheckCircle
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface RepairQuote {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  item_type: string | null;
  repair_type: string | null;
  description: string;
  image_urls: string[] | null;
  status: string | null;
  quoted_price: number | null;
  approved: boolean | null;
  tracking_number: string | null;
  created_at: string;
  updated_at: string | null;
  user_id: string | null;
  internal_notes: string | null;
  admin_image_urls: string[] | null;
  // Fulfillment fields
  fulfillment_method: string | null;
  preferred_dropoff_time: string | null;
  pickup_window: string | null;
  street_address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  logistics_notes: string | null;
  // Payment fields
  payment_status: string | null;
  payment_link_url: string | null;
  shopify_order_id: string | null;
  approved_at: string | null;
}

const statusOptions = [
  { value: "pending", label: "Submitted" },
  { value: "received", label: "Received" },
  { value: "in_progress", label: "In Progress" },
  { value: "polishing", label: "Polishing" },
  { value: "awaiting_parts", label: "Awaiting Parts" },
  { value: "completed", label: "Completed" },
  { value: "shipped", label: "Shipped" },
];

const filterStatusOptions = [
  { value: "all", label: "All Statuses" },
  ...statusOptions,
];

const fulfillmentOptions = [
  { value: "all", label: "All Methods" },
  { value: "mail_in", label: "Mail-In" },
  { value: "drop_off", label: "Drop Off" },
  { value: "courier", label: "Courier" },
];

type SortField = "created_at" | "status";
type SortOrder = "asc" | "desc";

export const AdminRepairsTab = () => {
  const [repairs, setRepairs] = useState<RepairQuote[]>([]);
  const [filteredRepairs, setFilteredRepairs] = useState<RepairQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRepair, setSelectedRepair] = useState<RepairQuote | null>(null);
  const [viewMode, setViewMode] = useState<"edit" | "customer">("edit");
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Form state
  const [newStatus, setNewStatus] = useState<string>("");
  const [newTrackingNumber, setNewTrackingNumber] = useState<string>("");
  const [newQuotedPrice, setNewQuotedPrice] = useState<string>("");
  const [newItemType, setNewItemType] = useState<string>("");
  const [newRepairType, setNewRepairType] = useState<string>("");
  const [newInternalNotes, setNewInternalNotes] = useState<string>("");
  
  // Fulfillment form state
  const [newFulfillmentMethod, setNewFulfillmentMethod] = useState<string>("");
  const [newStreetAddress, setNewStreetAddress] = useState<string>("");
  const [newCity, setNewCity] = useState<string>("");
  const [newState, setNewState] = useState<string>("");
  const [newZip, setNewZip] = useState<string>("");
  const [newPreferredDropoffTime, setNewPreferredDropoffTime] = useState<string>("");
  const [newPickupWindow, setNewPickupWindow] = useState<string>("");
  const [newLogisticsNotes, setNewLogisticsNotes] = useState<string>("");
  
  // Filters and sorting
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [fulfillmentFilter, setFulfillmentFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  
  // Image upload
  const [uploadingImages, setUploadingImages] = useState(false);
  const [adminImages, setAdminImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { updateRepairStatus } = useRepairStatusUpdate();

  useEffect(() => {
    fetchRepairs();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [repairs, statusFilter, fulfillmentFilter, searchQuery, sortField, sortOrder]);

  const fetchRepairs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("repair_quotes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRepairs((data as RepairQuote[]) || []);
    } catch (error) {
      console.error("Error fetching repairs:", error);
      toast.error("Failed to load repairs");
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...repairs];
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(r => r.status === statusFilter);
    }
    
    // Apply fulfillment filter
    if (fulfillmentFilter !== "all") {
      result = result.filter(r => r.fulfillment_method === fulfillmentFilter);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        r => r.name.toLowerCase().includes(query) || 
             r.email.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;
      
      if (sortField === "created_at") {
        aVal = new Date(a.created_at).getTime();
        bVal = new Date(b.created_at).getTime();
      } else {
        aVal = a.status || "";
        bVal = b.status || "";
      }
      
      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    
    setFilteredRepairs(result);
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const handleOpenRepair = (repair: RepairQuote, mode: "edit" | "customer" = "edit") => {
    setSelectedRepair(repair);
    setViewMode(mode);
    setNewStatus(repair.status || "pending");
    setNewTrackingNumber(repair.tracking_number || "");
    setNewQuotedPrice(repair.quoted_price?.toString() || "");
    setNewItemType(repair.item_type || "");
    setNewRepairType(repair.repair_type || "");
    setNewInternalNotes(repair.internal_notes || "");
    setAdminImages(repair.admin_image_urls || []);
    // Fulfillment fields
    setNewFulfillmentMethod(repair.fulfillment_method || "mail_in");
    setNewStreetAddress(repair.street_address || "");
    setNewCity(repair.city || "");
    setNewState(repair.state || "");
    setNewZip(repair.zip || "");
    setNewPreferredDropoffTime(repair.preferred_dropoff_time || "");
    setNewPickupWindow(repair.pickup_window || "");
    setNewLogisticsNotes(repair.logistics_notes || "");
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !selectedRepair) return;
    
    // Validate file types before upload
    const fileArray = Array.from(files);
    const { validFiles, errors } = validateImageFiles(fileArray);
    if (errors.length > 0) {
      toast.error("Only JPG, PNG, WebP, and GIF images are allowed");
      return;
    }
    if (validFiles.length === 0) return;
    
    setUploadingImages(true);
    const newUrls: string[] = [];
    
    try {
      for (const file of validFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${selectedRepair.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('admin-repair-images')
          .upload(fileName, file);
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('admin-repair-images')
          .getPublicUrl(fileName);
          
        newUrls.push(publicUrl);
      }
      
      setAdminImages([...adminImages, ...newUrls]);
      toast.success(`${files.length} image(s) uploaded`);
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload images");
    } finally {
      setUploadingImages(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAdminImage = (index: number) => {
    setAdminImages(adminImages.filter((_, i) => i !== index));
  };

  const handleUpdateRepair = async () => {
    if (!selectedRepair) return;

    setIsUpdating(true);
    try {
      // Build update object
      const updates: Record<string, any> = {
        updated_at: new Date().toISOString()
      };
      
      // Check for changes
      if (newQuotedPrice !== (selectedRepair.quoted_price?.toString() || "")) {
        updates.quoted_price = newQuotedPrice ? parseFloat(newQuotedPrice) : null;
      }
      if (newItemType !== (selectedRepair.item_type || "")) {
        updates.item_type = newItemType || null;
      }
      if (newRepairType !== (selectedRepair.repair_type || "")) {
        updates.repair_type = newRepairType || null;
      }
      if (newInternalNotes !== (selectedRepair.internal_notes || "")) {
        updates.internal_notes = newInternalNotes || null;
      }
      if (JSON.stringify(adminImages) !== JSON.stringify(selectedRepair.admin_image_urls || [])) {
        updates.admin_image_urls = adminImages;
      }
      if (newTrackingNumber !== (selectedRepair.tracking_number || "")) {
        updates.tracking_number = newTrackingNumber || null;
      }
      // Fulfillment updates
      if (newFulfillmentMethod !== (selectedRepair.fulfillment_method || "mail_in")) {
        updates.fulfillment_method = newFulfillmentMethod;
      }
      if (newStreetAddress !== (selectedRepair.street_address || "")) {
        updates.street_address = newStreetAddress || null;
      }
      if (newCity !== (selectedRepair.city || "")) {
        updates.city = newCity || null;
      }
      if (newState !== (selectedRepair.state || "")) {
        updates.state = newState || null;
      }
      if (newZip !== (selectedRepair.zip || "")) {
        updates.zip = newZip || null;
      }
      if (newPreferredDropoffTime !== (selectedRepair.preferred_dropoff_time || "")) {
        updates.preferred_dropoff_time = newPreferredDropoffTime || null;
      }
      if (newPickupWindow !== (selectedRepair.pickup_window || "")) {
        updates.pickup_window = newPickupWindow || null;
      }
      if (newLogisticsNotes !== (selectedRepair.logistics_notes || "")) {
        updates.logistics_notes = newLogisticsNotes || null;
      }

      // Apply non-status updates
      if (Object.keys(updates).length > 1) {
        const { error } = await supabase
          .from("repair_quotes")
          .update(updates)
          .eq("id", selectedRepair.id);
          
        if (error) throw error;
      }

      // Update status (which triggers email)
      if (newStatus !== selectedRepair.status) {
        await updateRepairStatus({
          repairId: selectedRepair.id,
          previousStatus: selectedRepair.status,
          newStatus: newStatus,
          trackingNumber: newStatus === "shipped" ? newTrackingNumber : undefined,
        });
      }

      await fetchRepairs();
      setSelectedRepair(null);
      toast.success("Repair updated successfully");
    } catch (error) {
      console.error("Error updating repair:", error);
      toast.error("Failed to update repair");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string | null) => {
    const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Submitted" },
      received: { bg: "bg-blue-100", text: "text-blue-700", label: "Received" },
      in_progress: { bg: "bg-purple-100", text: "text-purple-700", label: "In Progress" },
      polishing: { bg: "bg-indigo-100", text: "text-indigo-700", label: "Polishing" },
      awaiting_parts: { bg: "bg-orange-100", text: "text-orange-700", label: "Awaiting Parts" },
      completed: { bg: "bg-green-100", text: "text-green-700", label: "Completed" },
      shipped: { bg: "bg-teal-100", text: "text-teal-700", label: "Shipped" },
    };
    
    const style = statusStyles[status || "pending"] || statusStyles.pending;
    
    return (
      <Badge className={`${style.bg} ${style.text} border-0`}>
        {style.label}
      </Badge>
    );
  };

  const getFulfillmentBadge = (method: string | null) => {
    const styles: Record<string, { bg: string; text: string; label: string; icon: React.ElementType }> = {
      mail_in: { bg: "bg-blue-50", text: "text-blue-600", label: "Mail-In", icon: Package },
      drop_off: { bg: "bg-green-50", text: "text-green-600", label: "Drop Off", icon: MapPin },
      courier: { bg: "bg-purple-50", text: "text-purple-600", label: "Courier", icon: Truck },
    };
    
    const style = styles[method || "mail_in"] || styles.mail_in;
    const Icon = style.icon;
    
    return (
      <Badge className={`${style.bg} ${style.text} border-0 flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {style.label}
      </Badge>
    );
  };

  const getPaymentBadge = (paymentStatus: string | null, shopifyOrderId: string | null) => {
    const status = paymentStatus || 'unpaid';
    const styles: Record<string, { bg: string; text: string; label: string; icon: React.ElementType }> = {
      unpaid: { bg: "bg-gray-100", text: "text-gray-600", label: "Unpaid", icon: CreditCard },
      pending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending", icon: CreditCard },
      paid: { bg: "bg-green-100", text: "text-green-700", label: "Paid", icon: CheckCircle },
    };
    
    const style = styles[status] || styles.unpaid;
    const Icon = style.icon;
    
    return (
      <div className="flex flex-col gap-1">
        <Badge className={`${style.bg} ${style.text} border-0 flex items-center gap-1 w-fit`}>
          <Icon className="w-3 h-3" />
          {style.label}
        </Badge>
        {shopifyOrderId && (
          <span className="text-xs text-luxury-text-muted font-mono">#{shopifyOrderId}</span>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-luxury-champagne" />
      </div>
    );
  }

  return (
    <>
      <Card className="border-luxury-divider">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-luxury-text">Repair Quotes</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchRepairs}
            className="border-luxury-divider"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-text-muted" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-luxury-divider"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40 border-luxury-divider">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {filterStatusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={fulfillmentFilter} onValueChange={setFulfillmentFilter}>
              <SelectTrigger className="w-full sm:w-40 border-luxury-divider">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                {fulfillmentOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border border-luxury-divider overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-luxury-bg-warm">
                  <TableHead className="text-luxury-text text-xs">ID</TableHead>
                  <TableHead className="text-luxury-text">Customer</TableHead>
                  <TableHead className="text-luxury-text">Method</TableHead>
                  <TableHead className="text-luxury-text">Location</TableHead>
                  <TableHead 
                    className="text-luxury-text cursor-pointer hover:text-luxury-champagne"
                    onClick={() => toggleSort("status")}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-luxury-text">Quote</TableHead>
                  <TableHead className="text-luxury-text">Payment</TableHead>
                  <TableHead 
                    className="text-luxury-text cursor-pointer hover:text-luxury-champagne"
                    onClick={() => toggleSort("created_at")}
                  >
                    <div className="flex items-center gap-1">
                      Submitted
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-luxury-text">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRepairs.map((repair) => (
                  <TableRow key={repair.id} className="hover:bg-luxury-bg-warm/50">
                    <TableCell className="text-xs text-luxury-text-muted font-mono">
                      {repair.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-luxury-text">{repair.name}</p>
                        <p className="text-sm text-luxury-text-muted">{repair.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getFulfillmentBadge(repair.fulfillment_method)}</TableCell>
                    <TableCell className="text-luxury-text text-sm">
                      {repair.fulfillment_method === "courier" && repair.city && repair.state ? (
                        <span>{repair.city}, {repair.state} {repair.zip}</span>
                      ) : repair.fulfillment_method === "drop_off" ? (
                        <span className="text-luxury-text-muted">NYC</span>
                      ) : (
                        <span className="text-luxury-text-muted">—</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(repair.status)}</TableCell>
                    <TableCell className="text-luxury-text">
                      {repair.quoted_price 
                        ? `$${Number(repair.quoted_price).toFixed(2)}` 
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {getPaymentBadge(repair.payment_status, repair.shopify_order_id)}
                    </TableCell>
                    <TableCell className="text-luxury-text-muted text-sm">
                      {format(new Date(repair.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenRepair(repair, "edit")}
                          className="border-luxury-champagne text-luxury-champagne hover:bg-luxury-champagne/10"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenRepair(repair, "customer")}
                          className="border-luxury-divider"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredRepairs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-luxury-text-muted">
                      No repair quotes found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <p className="mt-3 text-sm text-luxury-text-muted">
            Showing {filteredRepairs.length} of {repairs.length} repairs
          </p>
        </CardContent>
      </Card>

      {/* Repair Management Sheet */}
      <Sheet open={!!selectedRepair} onOpenChange={() => setSelectedRepair(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto bg-white">
          {selectedRepair && (
            <>
              <SheetHeader>
                <SheetTitle className="text-xl text-luxury-text flex items-center gap-2">
                  {viewMode === "edit" ? (
                    <>
                      <Pencil className="w-5 h-5" />
                      Edit Repair
                    </>
                  ) : (
                    <>
                      <Eye className="w-5 h-5" />
                      Customer View
                    </>
                  )}
                </SheetTitle>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant={viewMode === "edit" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("edit")}
                    className={viewMode === "edit" ? "bg-luxury-champagne text-luxury-text" : ""}
                  >
                    Edit Mode
                  </Button>
                  <Button
                    variant={viewMode === "customer" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("customer")}
                    className={viewMode === "customer" ? "bg-luxury-champagne text-luxury-text" : ""}
                  >
                    Customer View
                  </Button>
                </div>
              </SheetHeader>

              <div className="space-y-6 py-6">
                {/* Repair ID & Fulfillment Method */}
                <div className="flex items-center justify-between p-3 bg-luxury-bg-warm rounded-lg">
                  <div>
                    <p className="text-xs text-luxury-text-muted">Repair ID</p>
                    <p className="font-mono text-sm text-luxury-text">{selectedRepair.id}</p>
                  </div>
                  {getFulfillmentBadge(selectedRepair.fulfillment_method)}
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-luxury-bg-warm rounded-lg">
                  <div>
                    <p className="text-sm text-luxury-text-muted">Customer</p>
                    <p className="font-medium text-luxury-text">{selectedRepair.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-luxury-text-muted">Email</p>
                    <p className="font-medium text-luxury-text">{selectedRepair.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-luxury-text-muted">Phone</p>
                    <p className="font-medium text-luxury-text">{selectedRepair.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-luxury-text-muted">Approved</p>
                    <p className="font-medium text-luxury-text">
                      {selectedRepair.approved ? "Yes" : "No"}
                    </p>
                  </div>
                </div>

                {/* Editable Fields */}
                {viewMode === "edit" ? (
                  <>
                    {/* Fulfillment Section */}
                    <div className="p-4 border border-luxury-divider rounded-lg space-y-4">
                      <h4 className="font-semibold text-luxury-text flex items-center gap-2">
                        <Truck className="w-4 h-4 text-luxury-champagne" />
                        Fulfillment Details
                      </h4>
                      
                      <div className="space-y-2">
                        <Label className="text-luxury-text">Fulfillment Method</Label>
                        <Select value={newFulfillmentMethod} onValueChange={setNewFulfillmentMethod}>
                          <SelectTrigger className="border-luxury-divider">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mail_in">Mail-In</SelectItem>
                            <SelectItem value="drop_off">Drop Off</SelectItem>
                            <SelectItem value="courier">Courier</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {newFulfillmentMethod === "drop_off" && (
                        <div className="space-y-2">
                          <Label className="text-luxury-text">Preferred Drop-Off Time</Label>
                          <Input
                            value={newPreferredDropoffTime}
                            onChange={(e) => setNewPreferredDropoffTime(e.target.value)}
                            placeholder="e.g., 2025-01-15 - Afternoon"
                            className="border-luxury-divider"
                          />
                        </div>
                      )}

                      {newFulfillmentMethod === "courier" && (
                        <>
                          <div className="space-y-2">
                            <Label className="text-luxury-text">Street Address</Label>
                            <Input
                              value={newStreetAddress}
                              onChange={(e) => setNewStreetAddress(e.target.value)}
                              className="border-luxury-divider"
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="space-y-2">
                              <Label className="text-luxury-text">City</Label>
                              <Input
                                value={newCity}
                                onChange={(e) => setNewCity(e.target.value)}
                                className="border-luxury-divider"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-luxury-text">State</Label>
                              <Input
                                value={newState}
                                onChange={(e) => setNewState(e.target.value)}
                                className="border-luxury-divider"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-luxury-text">ZIP</Label>
                              <Input
                                value={newZip}
                                onChange={(e) => setNewZip(e.target.value)}
                                className="border-luxury-divider"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-luxury-text">Pickup Window</Label>
                            <Input
                              value={newPickupWindow}
                              onChange={(e) => setNewPickupWindow(e.target.value)}
                              placeholder="e.g., weekday_morning"
                              className="border-luxury-divider"
                            />
                          </div>
                        </>
                      )}

                      <div className="space-y-2">
                        <Label className="text-luxury-text">Logistics Notes</Label>
                        <Textarea
                          value={newLogisticsNotes}
                          onChange={(e) => setNewLogisticsNotes(e.target.value)}
                          placeholder="Access notes, special instructions..."
                          rows={2}
                          className="border-luxury-divider"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="itemType" className="text-luxury-text">Item Type</Label>
                        <Input
                          id="itemType"
                          value={newItemType}
                          onChange={(e) => setNewItemType(e.target.value)}
                          placeholder="e.g., Ring, Necklace"
                          className="mt-1 border-luxury-divider"
                        />
                      </div>
                      <div>
                        <Label htmlFor="repairType" className="text-luxury-text">Repair Type</Label>
                        <Input
                          id="repairType"
                          value={newRepairType}
                          onChange={(e) => setNewRepairType(e.target.value)}
                          placeholder="e.g., Resize, Stone replacement"
                          className="mt-1 border-luxury-divider"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <Label className="text-luxury-text">Customer Description</Label>
                      <p className="mt-1 p-3 bg-luxury-bg-warm rounded text-luxury-text-muted text-sm">
                        {selectedRepair.description || "No description provided"}
                      </p>
                    </div>

                    {/* Customer Images */}
                    {selectedRepair.image_urls && selectedRepair.image_urls.length > 0 && (
                      <div>
                        <Label className="text-luxury-text flex items-center gap-2">
                          <ImageIcon className="w-4 h-4" />
                          Customer Photos
                        </Label>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {selectedRepair.image_urls.map((url, index) => (
                            <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                              <img
                                src={url}
                                alt={`Repair photo ${index + 1}`}
                                className="w-20 h-20 object-cover rounded border border-luxury-divider hover:border-luxury-champagne"
                              />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Admin Images */}
                    <div>
                      <Label className="text-luxury-text flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Admin Photos (Bench/Condition)
                      </Label>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {adminImages.map((url, index) => (
                          <div key={index} className="relative group">
                            <a href={url} target="_blank" rel="noopener noreferrer">
                              <img
                                src={url}
                                alt={`Admin photo ${index + 1}`}
                                className="w-20 h-20 object-cover rounded border border-luxury-divider hover:border-luxury-champagne"
                              />
                            </a>
                            <button
                              onClick={() => handleRemoveAdminImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImages}
                          className="w-20 h-20 border-2 border-dashed border-luxury-divider rounded flex items-center justify-center hover:border-luxury-champagne transition-colors"
                        >
                          {uploadingImages ? (
                            <Loader2 className="w-5 h-5 animate-spin text-luxury-text-muted" />
                          ) : (
                            <Upload className="w-5 h-5 text-luxury-text-muted" />
                          )}
                        </button>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>

                    {/* Quoted Price */}
                    <div>
                      <Label htmlFor="quotedPrice" className="text-luxury-text">Quoted Price ($)</Label>
                      <Input
                        id="quotedPrice"
                        type="number"
                        step="0.01"
                        value={newQuotedPrice}
                        onChange={(e) => setNewQuotedPrice(e.target.value)}
                        placeholder="Enter quote amount"
                        className="mt-1 border-luxury-divider"
                      />
                    </div>

                    {/* Status Update */}
                    <div>
                      <Label className="text-luxury-text flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Status (email sent on change)
                      </Label>
                      <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger className="mt-1 border-luxury-divider">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Tracking Number */}
                    <div>
                      <Label htmlFor="trackingNumber" className="text-luxury-text flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        Tracking Number
                      </Label>
                      <Input
                        id="trackingNumber"
                        value={newTrackingNumber}
                        onChange={(e) => setNewTrackingNumber(e.target.value)}
                        placeholder="Enter tracking number"
                        className="mt-1 border-luxury-divider"
                      />
                    </div>

                    {/* Internal Notes */}
                    <div>
                      <Label htmlFor="internalNotes" className="text-luxury-text flex items-center gap-2">
                        <StickyNote className="w-4 h-4" />
                        Internal Notes
                      </Label>
                      <Textarea
                        id="internalNotes"
                        value={newInternalNotes}
                        onChange={(e) => setNewInternalNotes(e.target.value)}
                        placeholder="Notes visible only to admins..."
                        rows={4}
                        className="mt-1 border-luxury-divider"
                      />
                    </div>
                  </>
                ) : (
                  /* Customer View */
                  <>
                    {/* Fulfillment Info */}
                    <div className="p-4 bg-luxury-bg-warm rounded-lg space-y-3">
                      <h4 className="font-semibold text-luxury-text">Fulfillment Method</h4>
                      {getFulfillmentBadge(selectedRepair.fulfillment_method)}
                      
                      {selectedRepair.fulfillment_method === "courier" && (
                        <div className="mt-3 text-sm text-luxury-text-muted">
                          <p><strong>Address:</strong> {selectedRepair.street_address}</p>
                          <p>{selectedRepair.city}, {selectedRepair.state} {selectedRepair.zip}</p>
                          {selectedRepair.pickup_window && (
                            <p><strong>Pickup Window:</strong> {selectedRepair.pickup_window}</p>
                          )}
                        </div>
                      )}
                      
                      {selectedRepair.fulfillment_method === "drop_off" && selectedRepair.preferred_dropoff_time && (
                        <div className="mt-3 text-sm text-luxury-text-muted">
                          <p><strong>Preferred Time:</strong> {selectedRepair.preferred_dropoff_time}</p>
                        </div>
                      )}
                      
                      {selectedRepair.logistics_notes && (
                        <div className="mt-3 text-sm text-luxury-text-muted">
                          <p><strong>Notes:</strong> {selectedRepair.logistics_notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-luxury-text-muted">Item Type</p>
                        <p className="font-medium text-luxury-text capitalize">{selectedRepair.item_type || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-luxury-text-muted">Repair Type</p>
                        <p className="font-medium text-luxury-text">{selectedRepair.repair_type || "Not specified"}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-luxury-text-muted">Description</p>
                      <p className="mt-1 p-3 bg-luxury-bg-warm rounded text-luxury-text">
                        {selectedRepair.description || "No description provided"}
                      </p>
                    </div>

                    {selectedRepair.image_urls && selectedRepair.image_urls.length > 0 && (
                      <div>
                        <p className="text-sm text-luxury-text-muted mb-2">Submitted Photos</p>
                        <div className="flex gap-2 flex-wrap">
                          {selectedRepair.image_urls.map((url, index) => (
                            <img
                              key={index}
                              src={url}
                              alt={`Repair photo ${index + 1}`}
                              className="w-24 h-24 object-cover rounded border border-luxury-divider"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="p-4 bg-luxury-bg-warm rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-luxury-text-muted">Status</p>
                        {getStatusBadge(selectedRepair.status)}
                      </div>
                      {selectedRepair.quoted_price && (
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-luxury-text-muted">Quoted Price</p>
                          <p className="font-semibold text-luxury-text">
                            ${Number(selectedRepair.quoted_price).toFixed(2)}
                          </p>
                        </div>
                      )}
                      {selectedRepair.tracking_number && (
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-sm text-luxury-text-muted">Tracking</p>
                          <p className="font-mono text-sm text-luxury-text">
                            {selectedRepair.tracking_number}
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Timestamps */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-luxury-text-muted">Submitted</p>
                    <p className="text-luxury-text">
                      {format(new Date(selectedRepair.created_at), "MMM d, yyyy h:mm a")}
                    </p>
                  </div>
                  <div>
                    <p className="text-luxury-text-muted">Last Updated</p>
                    <p className="text-luxury-text">
                      {selectedRepair.updated_at 
                        ? format(new Date(selectedRepair.updated_at), "MMM d, yyyy h:mm a")
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>

              <SheetFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedRepair(null)}
                  className="border-luxury-divider"
                >
                  Close
                </Button>
                {viewMode === "edit" && (
                  <Button
                    onClick={handleUpdateRepair}
                    disabled={isUpdating}
                    className="bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne/90"
                  >
                    {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save Changes
                  </Button>
                )}
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
