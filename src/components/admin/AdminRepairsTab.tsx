import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRepairStatusUpdate } from "@/hooks/useRepairStatusUpdate";
import { Loader2, Eye, RefreshCw, Mail, Truck } from "lucide-react";
import { format } from "date-fns";

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

export const AdminRepairsTab = () => {
  const [repairs, setRepairs] = useState<RepairQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRepair, setSelectedRepair] = useState<RepairQuote | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [newTrackingNumber, setNewTrackingNumber] = useState<string>("");
  const [newQuotedPrice, setNewQuotedPrice] = useState<string>("");
  const { updateRepairStatus } = useRepairStatusUpdate();

  useEffect(() => {
    fetchRepairs();
  }, []);

  const fetchRepairs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("repair_quotes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRepairs(data || []);
    } catch (error) {
      console.error("Error fetching repairs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRepair = (repair: RepairQuote) => {
    setSelectedRepair(repair);
    setNewStatus(repair.status || "pending");
    setNewTrackingNumber(repair.tracking_number || "");
    setNewQuotedPrice(repair.quoted_price?.toString() || "");
  };

  const handleUpdateRepair = async () => {
    if (!selectedRepair) return;

    setIsUpdating(true);
    try {
      // Update quoted price if changed
      if (newQuotedPrice !== (selectedRepair.quoted_price?.toString() || "")) {
        await supabase
          .from("repair_quotes")
          .update({ 
            quoted_price: newQuotedPrice ? parseFloat(newQuotedPrice) : null,
            updated_at: new Date().toISOString()
          })
          .eq("id", selectedRepair.id);
      }

      // Update status (which triggers email)
      if (newStatus !== selectedRepair.status) {
        await updateRepairStatus({
          repairId: selectedRepair.id,
          previousStatus: selectedRepair.status,
          newStatus: newStatus,
          trackingNumber: newStatus === "shipped" ? newTrackingNumber : undefined,
        });
      } else if (newTrackingNumber !== (selectedRepair.tracking_number || "")) {
        // Just update tracking number without status change
        await supabase
          .from("repair_quotes")
          .update({ 
            tracking_number: newTrackingNumber,
            updated_at: new Date().toISOString()
          })
          .eq("id", selectedRepair.id);
      }

      await fetchRepairs();
      setSelectedRepair(null);
    } catch (error) {
      console.error("Error updating repair:", error);
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
        <CardHeader className="flex flex-row items-center justify-between">
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
          <div className="rounded-md border border-luxury-divider overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-luxury-bg-warm">
                  <TableHead className="text-luxury-text">Customer</TableHead>
                  <TableHead className="text-luxury-text">Item</TableHead>
                  <TableHead className="text-luxury-text">Status</TableHead>
                  <TableHead className="text-luxury-text">Quote</TableHead>
                  <TableHead className="text-luxury-text">Submitted</TableHead>
                  <TableHead className="text-luxury-text">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {repairs.map((repair) => (
                  <TableRow key={repair.id} className="hover:bg-luxury-bg-warm/50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-luxury-text">{repair.name}</p>
                        <p className="text-sm text-luxury-text-muted">{repair.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize text-luxury-text">
                      {repair.item_type || "—"}
                    </TableCell>
                    <TableCell>{getStatusBadge(repair.status)}</TableCell>
                    <TableCell className="text-luxury-text">
                      {repair.quoted_price 
                        ? `$${Number(repair.quoted_price).toFixed(2)}` 
                        : "—"}
                    </TableCell>
                    <TableCell className="text-luxury-text-muted">
                      {format(new Date(repair.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenRepair(repair)}
                        className="border-luxury-champagne text-luxury-champagne hover:bg-luxury-champagne/10"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {repairs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-luxury-text-muted">
                      No repair quotes found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Repair Management Dialog */}
      <Dialog open={!!selectedRepair} onOpenChange={() => setSelectedRepair(null)}>
        <DialogContent className="max-w-2xl bg-white">
          {selectedRepair && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl text-luxury-text">
                  Manage Repair - {selectedRepair.name}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
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
                    <p className="text-sm text-luxury-text-muted">Item Type</p>
                    <p className="font-medium text-luxury-text capitalize">{selectedRepair.item_type || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-luxury-text-muted">Repair Type</p>
                    <p className="font-medium text-luxury-text">{selectedRepair.repair_type || "Not specified"}</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label className="text-luxury-text">Description</Label>
                  <p className="mt-1 p-3 bg-luxury-bg-warm rounded text-luxury-text-muted">
                    {selectedRepair.description || "No description provided"}
                  </p>
                </div>

                {/* Images */}
                {selectedRepair.image_urls && selectedRepair.image_urls.length > 0 && (
                  <div>
                    <Label className="text-luxury-text">Submitted Photos</Label>
                    <div className="flex gap-2 mt-2 overflow-x-auto">
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
                    Status (email will be sent on change)
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

                {/* Tracking Number (shown when status is shipped) */}
                {newStatus === "shipped" && (
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
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setSelectedRepair(null)}
                  className="border-luxury-divider"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateRepair}
                  disabled={isUpdating}
                  className="bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne/90"
                >
                  {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
