import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Shield, Search, X, ChevronDown, Send, Save, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface CustomInquiry {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  piece_type: string;
  description: string;
  image_urls: string[] | null;
  status: string | null;
  budget_range: string | null;
  user_id: string | null;
  assigned_to: string | null;
  admin_internal_notes: string | null;
  admin_quote_amount: number | null;
  admin_quote_message: string | null;
}

// Statuses that trigger customer email notifications
const EMAIL_TRIGGER_STATUSES = ['in_cad', 'awaiting_client_approval', 'in_production', 'completed', 'cancelled'];

interface UserDesign {
  id: string;
  name: string;
  overview: string | null;
  hero_image_url: string | null;
  side_image_url: string | null;
  top_image_url: string | null;
  spec_sheet: Record<string, unknown> | null;
  inspiration_image_urls: string[] | null;
  flow_type: string;
}

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "New / Pending" },
  { value: "quoted", label: "Quoted" },
  { value: "in_cad", label: "In CAD" },
  { value: "awaiting_client_approval", label: "Awaiting Client Approval" },
  { value: "approved", label: "Approved" },
  { value: "in_production", label: "In Production" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const MODE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "engagement", label: "Engagement" },
  { value: "custom", label: "Custom Jewelry" },
];

const getStatusBadgeVariant = (status: string | null) => {
  switch (status) {
    case "pending":
      return "secondary";
    case "quoted":
      return "outline";
    case "in_cad":
      return "default";
    case "awaiting_client_approval":
      return "outline";
    case "approved":
      return "default";
    case "in_production":
      return "default";
    case "completed":
      return "secondary";
    case "cancelled":
      return "destructive";
    default:
      return "secondary";
  }
};

const AdminCadQueue = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [inquiries, setInquiries] = useState<CustomInquiry[]>([]);
  const [linkedDesigns, setLinkedDesigns] = useState<Map<string, UserDesign>>(new Map());
  const [loadingData, setLoadingData] = useState(false);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Detail panel states
  const [selectedInquiry, setSelectedInquiry] = useState<CustomInquiry | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<UserDesign | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  
  // Edit states for detail panel
  const [editStatus, setEditStatus] = useState("");
  const [editAssignedTo, setEditAssignedTo] = useState("");
  const [editInternalNotes, setEditInternalNotes] = useState("");
  const [editQuoteAmount, setEditQuoteAmount] = useState("");
  const [quoteMessage, setQuoteMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [sendingQuote, setSendingQuote] = useState(false);

  // Check admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        setUser(session.user);

        const { data: roleData, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (error) {
          console.error('Error checking admin role:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!roleData);
        }
      } catch (error) {
        console.error('Error in admin check:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch inquiries
  useEffect(() => {
    if (!isAdmin) return;
    fetchInquiries();
  }, [isAdmin, statusFilter, modeFilter]);

  const fetchInquiries = async () => {
    setLoadingData(true);
    try {
      let query = supabase
        .from('custom_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq('status', statusFilter);
      }

      if (modeFilter !== "all") {
        if (modeFilter === "engagement") {
          query = query.ilike('piece_type', '%engagement%');
        } else {
          query = query.not('piece_type', 'ilike', '%engagement%');
        }
      }

      const { data, error } = await query;

      if (error) throw error;

      setInquiries(data || []);

      // Fetch linked designs from user_designs table
      const inquiryIds = (data || []).map(i => i.id);
      if (inquiryIds.length > 0) {
        const { data: designsData } = await supabase
          .from('user_designs')
          .select('*')
          .in('custom_inquiry_id', inquiryIds);

        const designMap = new Map<string, UserDesign>();
        (designsData || []).forEach(d => {
          if (d.custom_inquiry_id) {
            designMap.set(d.custom_inquiry_id, d as UserDesign);
          }
        });
        setLinkedDesigns(designMap);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      toast.error('Failed to load inquiries');
    } finally {
      setLoadingData(false);
    }
  };

  // Filter inquiries by search
  const filteredInquiries = inquiries.filter(inquiry => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      inquiry.email.toLowerCase().includes(q) ||
      inquiry.name.toLowerCase().includes(q) ||
      inquiry.id.toLowerCase().includes(q) ||
      (linkedDesigns.get(inquiry.id)?.name || "").toLowerCase().includes(q)
    );
  });

  const openDetailPanel = (inquiry: CustomInquiry) => {
    setSelectedInquiry(inquiry);
    setSelectedDesign(linkedDesigns.get(inquiry.id) || null);
    setEditStatus(inquiry.status || "pending");
    setEditAssignedTo(inquiry.assigned_to || "");
    setEditInternalNotes(inquiry.admin_internal_notes || "");
    setEditQuoteAmount(inquiry.admin_quote_amount?.toString() || "");
    setQuoteMessage("");
    setPanelOpen(true);
  };

  const saveChanges = async () => {
    if (!selectedInquiry) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('custom_inquiries')
        .update({
          status: editStatus,
          assigned_to: editAssignedTo || null,
          admin_internal_notes: editInternalNotes || null,
          admin_quote_amount: editQuoteAmount ? parseFloat(editQuoteAmount) : null,
        })
        .eq('id', selectedInquiry.id);

      if (error) throw error;

      toast.success('Changes saved');
      fetchInquiries();
      
      // Update local state
      setSelectedInquiry({
        ...selectedInquiry,
        status: editStatus,
        assigned_to: editAssignedTo || null,
        admin_internal_notes: editInternalNotes || null,
        admin_quote_amount: editQuoteAmount ? parseFloat(editQuoteAmount) : null,
      });
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const sendQuote = async () => {
    if (!selectedInquiry || !editQuoteAmount) {
      toast.error('Please enter a quote amount');
      return;
    }

    setSendingQuote(true);

    try {
      // First save the quote amount and message
      const { error: updateError } = await supabase
        .from('custom_inquiries')
        .update({
          admin_quote_amount: parseFloat(editQuoteAmount),
          admin_quote_message: quoteMessage || null,
          status: 'quoted',
        })
        .eq('id', selectedInquiry.id);

      if (updateError) throw updateError;

      // Send quote email using centralized email function
      const { error: emailError } = await supabase.functions.invoke('send-cad-workflow-email', {
        body: {
          template: 'customer_quote_ready',
          to_email: selectedInquiry.email,
          data: {
            customer_name: selectedInquiry.name,
            quote_amount: parseFloat(editQuoteAmount),
            design_name: selectedDesign?.name || 'Custom Jewelry',
            message: quoteMessage,
            account_link: `${window.location.origin}/account`,
            inquiry_id: selectedInquiry.id,
          },
        },
      });

      if (emailError) {
        console.error('Email error:', emailError);
        toast.error('Quote saved but email failed to send');
      } else {
        toast.success('Quote sent to customer');
      }

      setEditStatus('quoted');
      setSelectedInquiry({
        ...selectedInquiry,
        status: 'quoted',
        admin_quote_amount: parseFloat(editQuoteAmount),
        admin_quote_message: quoteMessage || null,
      });
      fetchInquiries();
    } catch (error) {
      console.error('Error sending quote:', error);
      toast.error('Failed to send quote');
    } finally {
      setSendingQuote(false);
    }
  };

  const sendStatusEmail = async (inquiry: CustomInquiry, newStatus: string) => {
    try {
      const { error } = await supabase.functions.invoke('send-cad-workflow-email', {
        body: {
          template: 'customer_status_update',
          to_email: inquiry.email,
          data: {
            customer_name: inquiry.name,
            new_status: newStatus,
            design_name: selectedDesign?.name,
            account_link: `${window.location.origin}/account`,
            inquiry_id: inquiry.id,
          },
        },
      });

      if (error) {
        console.error('Failed to send status email:', error);
      } else {
        console.log(`Status update email sent for status: ${newStatus}`);
      }
    } catch (error) {
      console.error('Error sending status email:', error);
    }
  };

  const quickStatusUpdate = async (newStatus: string, sendEmail: boolean = true) => {
    if (!selectedInquiry) return;

    try {
      const { error } = await supabase
        .from('custom_inquiries')
        .update({ status: newStatus })
        .eq('id', selectedInquiry.id);

      if (error) throw error;

      // Send customer email for specific status changes
      if (sendEmail && EMAIL_TRIGGER_STATUSES.includes(newStatus)) {
        await sendStatusEmail(selectedInquiry, newStatus);
        toast.success(`Status updated to "${newStatus}" and customer notified`);
      } else {
        toast.success(`Status updated to "${newStatus}"`);
      }
      
      setEditStatus(newStatus);
      setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      fetchInquiries();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-semibold text-foreground mb-2">Unauthorized</h1>
          <p className="text-muted-foreground mb-4">Admin access required.</p>
          <Button onClick={() => navigate('/')}>Go to Homepage</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif text-foreground">CAD Queue</h1>
            <p className="text-muted-foreground text-sm">Incoming custom designs awaiting CAD review.</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/admin')}>
            Back to Admin
          </Button>
        </div>
      </header>

      {/* Filters */}
      <div className="px-6 py-4 border-b border-border bg-card/50">
        <div className="flex flex-wrap gap-4 items-center">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={modeFilter} onValueChange={setModeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {MODE_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by email, name, ID, or design name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="p-6">
        {loadingData ? (
          <div className="text-center py-12 text-muted-foreground">Loading inquiries...</div>
        ) : filteredInquiries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No inquiries found.</div>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Created</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Design</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInquiries.map((inquiry) => {
                  const design = linkedDesigns.get(inquiry.id);
                  return (
                    <TableRow 
                      key={inquiry.id} 
                      className="cursor-pointer hover:bg-muted/30"
                      onClick={() => openDetailPanel(inquiry)}
                    >
                      <TableCell className="text-sm">
                        {new Date(inquiry.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{inquiry.name}</div>
                        <div className="text-xs text-muted-foreground">{inquiry.email}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {inquiry.piece_type.toLowerCase().includes('engagement') ? 'Engagement' : 'Custom'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {design ? design.name : 'Direct Upload'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(inquiry.status)}>
                          {inquiry.status || 'pending'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {inquiry.assigned_to || '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDetailPanel(inquiry);
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Detail Panel */}
      <Sheet open={panelOpen} onOpenChange={setPanelOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Inquiry Details</SheetTitle>
          </SheetHeader>

          {selectedInquiry && (
            <div className="mt-6 space-y-6">
              {/* Inquiry Metadata */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Inquiry Info</h3>
                <div className="bg-muted/30 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID:</span>
                    <span className="font-mono text-xs">{selectedInquiry.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span>{new Date(selectedInquiry.created_at).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={getStatusBadgeVariant(selectedInquiry.status)}>
                      {selectedInquiry.status || 'pending'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Budget:</span>
                    <span>{selectedInquiry.budget_range || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quote:</span>
                    <span>{selectedInquiry.admin_quote_amount ? `$${selectedInquiry.admin_quote_amount.toLocaleString()}` : '—'}</span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Customer</h3>
                <div className="bg-muted/30 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span>{selectedInquiry.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{selectedInquiry.email}</span>
                  </div>
                  {selectedInquiry.phone && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span>{selectedInquiry.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Design Details (if linked) */}
              {selectedDesign && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Linked Design</h3>
                  <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                    <div>
                      <div className="font-medium">{selectedDesign.name}</div>
                      {selectedDesign.overview && (
                        <p className="text-sm text-muted-foreground mt-1">{selectedDesign.overview}</p>
                      )}
                    </div>

                    {/* Design Images */}
                    <div className="grid grid-cols-3 gap-2">
                      {selectedDesign.hero_image_url && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Hero</p>
                          <img 
                            src={selectedDesign.hero_image_url} 
                            alt="Hero view" 
                            className="w-full aspect-square object-cover rounded-md"
                          />
                        </div>
                      )}
                      {selectedDesign.side_image_url && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Side</p>
                          <img 
                            src={selectedDesign.side_image_url} 
                            alt="Side view" 
                            className="w-full aspect-square object-cover rounded-md"
                          />
                        </div>
                      )}
                      {selectedDesign.top_image_url && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Top</p>
                          <img 
                            src={selectedDesign.top_image_url} 
                            alt="Top view" 
                            className="w-full aspect-square object-cover rounded-md"
                          />
                        </div>
                      )}
                    </div>

                    {/* Spec Sheet */}
                    {selectedDesign.spec_sheet && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Specifications</p>
                        <pre className="text-xs bg-background p-3 rounded-md overflow-x-auto max-h-48">
                          {JSON.stringify(selectedDesign.spec_sheet, null, 2)}
                        </pre>
                      </div>
                    )}

                    {/* Inspiration Images */}
                    {selectedDesign.inspiration_image_urls && selectedDesign.inspiration_image_urls.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Inspiration Images</p>
                        <div className="grid grid-cols-4 gap-2">
                          {selectedDesign.inspiration_image_urls.map((url, idx) => (
                            <img 
                              key={idx}
                              src={url} 
                              alt={`Inspiration ${idx + 1}`} 
                              className="w-full aspect-square object-cover rounded-md"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Direct Upload (no design) */}
              {!selectedDesign && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Project Details</h3>
                  <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Type</p>
                      <p className="text-sm">{selectedInquiry.piece_type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Description</p>
                      <p className="text-sm">{selectedInquiry.description}</p>
                    </div>
                    {selectedInquiry.image_urls && selectedInquiry.image_urls.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Uploaded Images</p>
                        <div className="grid grid-cols-3 gap-2">
                          {selectedInquiry.image_urls.map((url, idx) => (
                            <img 
                              key={idx}
                              src={url} 
                              alt={`Upload ${idx + 1}`} 
                              className="w-full aspect-square object-cover rounded-md"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Admin Actions */}
              <div className="space-y-4 border-t border-border pt-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Admin Actions</h3>

                {/* Status */}
                <div>
                  <label className="text-sm font-medium">Set Status</label>
                  <Select value={editStatus} onValueChange={setEditStatus}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.filter(o => o.value !== 'all').map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Assigned To */}
                <div>
                  <label className="text-sm font-medium">Assign CAD Designer</label>
                  <Input
                    value={editAssignedTo}
                    onChange={(e) => setEditAssignedTo(e.target.value)}
                    placeholder="Email or name"
                    className="mt-1"
                  />
                </div>

                {/* Internal Notes */}
                <div>
                  <label className="text-sm font-medium">Internal Notes</label>
                  <Textarea
                    value={editInternalNotes}
                    onChange={(e) => setEditInternalNotes(e.target.value)}
                    placeholder="Notes for internal team..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <Button onClick={saveChanges} disabled={saving} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>

                {/* Quick Status Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => quickStatusUpdate('in_cad')}
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    Mark In CAD
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => quickStatusUpdate('awaiting_client_approval')}
                  >
                    Awaiting Approval
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => quickStatusUpdate('completed')}
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                  </Button>
                </div>

                {/* Send Quote Section */}
                <div className="border-t border-border pt-4 space-y-3">
                  <h4 className="font-medium text-sm">Send Quote</h4>
                  <div>
                    <label className="text-sm text-muted-foreground">Quote Amount ($)</label>
                    <Input
                      type="number"
                      value={editQuoteAmount}
                      onChange={(e) => setEditQuoteAmount(e.target.value)}
                      placeholder="e.g. 3500"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Message to Customer</label>
                    <Textarea
                      value={quoteMessage}
                      onChange={(e) => setQuoteMessage(e.target.value)}
                      placeholder="Optional personalized message..."
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                  <Button 
                    onClick={sendQuote} 
                    disabled={sendingQuote || !editQuoteAmount}
                    className="w-full"
                    variant="default"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {sendingQuote ? 'Sending...' : 'Send Quote Email'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminCadQueue;
