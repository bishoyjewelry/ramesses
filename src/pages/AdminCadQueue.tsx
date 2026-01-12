import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { 
  Shield, Search, Save, Clock, CheckCircle, XCircle, 
  AlertTriangle, Send, Download, Eye, ChevronRight,
  Timer, ArrowRight
} from "lucide-react";
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
  status_updated_at: string | null;
  budget_range: string | null;
  user_id: string | null;
  assigned_to: string | null;
  admin_internal_notes: string | null;
  admin_quote_amount: number | null;
  admin_quote_message: string | null;
}

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
  status: string;
  revision_notes: string | null;
  revision_requested_at: string | null;
  revision_contact_preference: string | null;
}

// STRICT STATUS ENUM - Manual changes only
const CAD_STATUSES = {
  new: { label: "New — Needs Review", slaHours: 24, order: 1 },
  revision_requested: { label: "Revision Requested", slaHours: 24, order: 2 },
  reviewed: { label: "Reviewed — Needs Quote", slaHours: 24, order: 3 },
  quoted: { label: "Quote Sent — Waiting Customer", slaHours: null, order: 4 },
  approved: { label: "Approved — Send to CAD", slaHours: 48, order: 5 },
  in_cad: { label: "In CAD", slaHours: 120, order: 6 }, // 5 business days
  cad_complete: { label: "CAD Complete — Awaiting Approval", slaHours: null, order: 7 },
  production_ready: { label: "Production Ready", slaHours: null, order: 8 },
  completed: { label: "Completed", slaHours: null, order: 9 },
  declined: { label: "Closed / Declined", slaHours: null, order: 10 },
} as const;

type CadStatus = keyof typeof CAD_STATUSES;

// Email triggers
const EMAIL_TRIGGER_STATUSES: CadStatus[] = ['quoted', 'approved', 'in_cad', 'cad_complete', 'production_ready', 'completed'];

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  ...Object.entries(CAD_STATUSES).map(([value, { label }]) => ({ value, label })),
];

const MODE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "engagement", label: "Engagement" },
  { value: "custom", label: "Custom Jewelry" },
];

// SLA calculation helpers
function calculateSlaStatus(
  status: string | null, 
  statusUpdatedAt: string | null
): { state: 'green' | 'yellow' | 'red' | 'none'; hoursRemaining: number | null; label: string } {
  const statusKey = (status || 'new') as CadStatus;
  const statusConfig = CAD_STATUSES[statusKey];
  
  if (!statusConfig || statusConfig.slaHours === null) {
    return { state: 'none', hoursRemaining: null, label: 'No SLA' };
  }

  const updatedAt = statusUpdatedAt ? new Date(statusUpdatedAt) : new Date();
  const now = new Date();
  const hoursElapsed = (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60);
  const hoursRemaining = statusConfig.slaHours - hoursElapsed;
  
  if (hoursRemaining < 0) {
    return { state: 'red', hoursRemaining, label: `${Math.abs(Math.round(hoursRemaining))}h overdue` };
  } else if (hoursRemaining < statusConfig.slaHours * 0.25) {
    return { state: 'yellow', hoursRemaining, label: `${Math.round(hoursRemaining)}h left` };
  } else {
    return { state: 'green', hoursRemaining, label: `${Math.round(hoursRemaining)}h left` };
  }
}

function getSlaIndicatorColor(state: 'green' | 'yellow' | 'red' | 'none'): string {
  switch (state) {
    case 'green': return 'bg-green-500';
    case 'yellow': return 'bg-yellow-500';
    case 'red': return 'bg-red-500';
    default: return 'bg-muted';
  }
}

function getStatusBadgeVariant(status: string | null): "default" | "secondary" | "destructive" | "outline" {
  const statusKey = (status || 'new') as CadStatus;
  switch (statusKey) {
    case "new":
      return "secondary";
    case "revision_requested":
      return "destructive";
    case "reviewed":
      return "outline";
    case "quoted":
      return "outline";
    case "approved":
      return "default";
    case "in_cad":
      return "default";
    case "cad_complete":
      return "default";
    case "production_ready":
      return "default";
    case "completed":
      return "secondary";
    case "declined":
      return "destructive";
    default:
      return "secondary";
  }
}

function getNextAction(status: string | null): string {
  const statusKey = (status || 'new') as CadStatus;
  switch (statusKey) {
    case "new": return "Review design";
    case "revision_requested": return "Review revision request";
    case "reviewed": return "Send quote";
    case "quoted": return "Waiting for customer";
    case "approved": return "Start CAD work";
    case "in_cad": return "Complete CAD";
    case "cad_complete": return "Get customer approval";
    case "production_ready": return "Begin production";
    case "completed": return "Archive";
    case "declined": return "—";
    default: return "Review";
  }
}

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

      // Map pending to new for backwards compatibility
      const normalizedData = (data || []).map(item => ({
        ...item,
        status: item.status === 'pending' ? 'new' : item.status,
        status_updated_at: (item as CustomInquiry).status_updated_at || item.created_at,
      }));

      setInquiries(normalizedData as CustomInquiry[]);

      // Fetch linked designs from user_designs table
      const inquiryIds = normalizedData.map(i => i.id);
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

  // Sort by SLA urgency
  const sortedInquiries = [...filteredInquiries].sort((a, b) => {
    const slaA = calculateSlaStatus(a.status, a.status_updated_at);
    const slaB = calculateSlaStatus(b.status, b.status_updated_at);
    
    // Red items first, then yellow, then green, then none
    const priorityMap = { red: 0, yellow: 1, green: 2, none: 3 };
    const priorityDiff = priorityMap[slaA.state] - priorityMap[slaB.state];
    if (priorityDiff !== 0) return priorityDiff;
    
    // Within same priority, sort by hours remaining
    if (slaA.hoursRemaining !== null && slaB.hoursRemaining !== null) {
      return slaA.hoursRemaining - slaB.hoursRemaining;
    }
    
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const openDetailPanel = (inquiry: CustomInquiry) => {
    setSelectedInquiry(inquiry);
    setSelectedDesign(linkedDesigns.get(inquiry.id) || null);
    setEditStatus(inquiry.status || "new");
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
      const previousStatus = selectedInquiry.status;
      
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

      // Send email if status changed to a trigger status
      if (previousStatus !== editStatus && EMAIL_TRIGGER_STATUSES.includes(editStatus as CadStatus)) {
        await sendStatusEmail(selectedInquiry, editStatus);
      }

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
            account_link: `${window.location.origin}/my-designs`,
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
            account_link: `${window.location.origin}/my-designs`,
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

  const quickStatusUpdate = async (newStatus: CadStatus, sendEmail: boolean = true) => {
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
        toast.success(`Status updated to "${CAD_STATUSES[newStatus].label}" and customer notified`);
      } else {
        toast.success(`Status updated to "${CAD_STATUSES[newStatus].label}"`);
      }
      
      setEditStatus(newStatus);
      setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      fetchInquiries();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const downloadImages = (urls: string[]) => {
    urls.forEach((url, index) => {
      const link = document.createElement('a');
      link.href = url;
      link.download = `design-image-${index + 1}.jpg`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  // Statistics
  const stats = {
    total: inquiries.length,
    needsReview: inquiries.filter(i => i.status === 'new').length,
    needsQuote: inquiries.filter(i => i.status === 'reviewed').length,
    inCad: inquiries.filter(i => i.status === 'in_cad').length,
    overdue: inquiries.filter(i => calculateSlaStatus(i.status, i.status_updated_at).state === 'red').length,
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
            <p className="text-muted-foreground text-sm">Manage custom designs from submission to production.</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/admin')}>
            Back to Admin
          </Button>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="px-6 py-4 bg-muted/30 border-b border-border">
        <div className="flex gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Total:</span>
            <span className="font-semibold">{stats.total}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-sm text-muted-foreground">Needs Review:</span>
            <span className="font-semibold">{stats.needsReview}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-sm text-muted-foreground">Needs Quote:</span>
            <span className="font-semibold">{stats.needsQuote}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="text-sm text-muted-foreground">In CAD:</span>
            <span className="font-semibold">{stats.inCad}</span>
          </div>
          {stats.overdue > 0 && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">SLA Breached:</span>
              <span className="font-semibold">{stats.overdue}</span>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 border-b border-border bg-card/50">
        <div className="flex flex-wrap gap-4 items-center">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[260px]">
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
        ) : sortedInquiries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No inquiries found.</div>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[40px]">SLA</TableHead>
                  <TableHead>Thumbnail</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Next Action</TableHead>
                  <TableHead>Assigned</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedInquiries.map((inquiry) => {
                  const design = linkedDesigns.get(inquiry.id);
                  const sla = calculateSlaStatus(inquiry.status, inquiry.status_updated_at);
                  const thumbnail = design?.hero_image_url || (inquiry.image_urls && inquiry.image_urls[0]);
                  const hasRevisionRequest = design?.status === 'revision_requested';
                  
                  return (
                    <TableRow 
                      key={inquiry.id} 
                      className={`cursor-pointer hover:bg-muted/30 ${sla.state === 'red' ? 'bg-red-50 dark:bg-red-950/20' : ''} ${hasRevisionRequest ? 'bg-orange-50 dark:bg-orange-950/20' : ''}`}
                      onClick={() => openDetailPanel(inquiry)}
                    >
                      {/* SLA Indicator */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getSlaIndicatorColor(sla.state)}`} />
                          {sla.state !== 'none' && (
                            <span className={`text-xs ${sla.state === 'red' ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}>
                              {sla.label}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Thumbnail */}
                      <TableCell>
                        {thumbnail ? (
                          <img 
                            src={thumbnail} 
                            alt="Design" 
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>

                      {/* Customer */}
                      <TableCell>
                        <div className="text-sm font-medium">{inquiry.name}</div>
                        <div className="text-xs text-muted-foreground">{inquiry.email}</div>
                      </TableCell>

                      {/* Type */}
                      <TableCell>
                        <Badge variant="outline">
                          {inquiry.piece_type.toLowerCase().includes('engagement') ? 'Engagement' : 'Custom'}
                        </Badge>
                      </TableCell>

                      {/* Source */}
                      <TableCell className="text-sm text-muted-foreground">
                        {design ? 'Design Studio' : 'Direct Upload'}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant={getStatusBadgeVariant(inquiry.status)}>
                            {CAD_STATUSES[(inquiry.status || 'new') as CadStatus]?.label || inquiry.status}
                          </Badge>
                          {hasRevisionRequest && (
                            <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600 text-xs">
                              Revision Requested
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      {/* Next Action */}
                      <TableCell className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <ArrowRight className="w-3 h-3" />
                          {getNextAction(inquiry.status)}
                        </div>
                      </TableCell>

                      {/* Assigned */}
                      <TableCell className="text-sm text-muted-foreground">
                        {inquiry.assigned_to || '—'}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDetailPanel(inquiry);
                          }}
                        >
                          <ChevronRight className="w-4 h-4" />
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
            <SheetTitle>Design Details</SheetTitle>
          </SheetHeader>

          {selectedInquiry && (
            <div className="mt-6 space-y-6">
              {/* SLA Status Banner */}
              {(() => {
                const sla = calculateSlaStatus(selectedInquiry.status, selectedInquiry.status_updated_at);
                if (sla.state === 'red') {
                  return (
                    <div className="bg-red-100 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="font-medium text-red-800 dark:text-red-200">SLA Breached</p>
                        <p className="text-sm text-red-600 dark:text-red-400">{sla.label}</p>
                      </div>
                    </div>
                  );
                }
                if (sla.state === 'yellow') {
                  return (
                    <div className="bg-yellow-100 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-center gap-3">
                      <Timer className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="font-medium text-yellow-800 dark:text-yellow-200">Approaching SLA</p>
                        <p className="text-sm text-yellow-600 dark:text-yellow-400">{sla.label}</p>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Revision Request Banner - Show prominently when revision is requested */}
              {selectedDesign && selectedDesign.status === 'revision_requested' && selectedDesign.revision_notes && (
                <div className="bg-orange-100 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-orange-800 dark:text-orange-200">Revision Requested</h3>
                  </div>
                  <div className="bg-white/50 dark:bg-black/20 rounded p-3 text-sm">
                    <p className="text-orange-900 dark:text-orange-100 whitespace-pre-wrap">{selectedDesign.revision_notes}</p>
                  </div>
                  <div className="flex gap-4 text-xs text-orange-700 dark:text-orange-300">
                    {selectedDesign.revision_requested_at && (
                      <span>Requested: {new Date(selectedDesign.revision_requested_at).toLocaleString()}</span>
                    )}
                    {selectedDesign.revision_contact_preference && (
                      <span>Prefers: {selectedDesign.revision_contact_preference}</span>
                    )}
                  </div>
                </div>
              )}
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
                    <span className="text-muted-foreground">Status Updated:</span>
                    <span>{selectedInquiry.status_updated_at ? new Date(selectedInquiry.status_updated_at).toLocaleString() : '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={getStatusBadgeVariant(selectedInquiry.status)}>
                      {CAD_STATUSES[(selectedInquiry.status || 'new') as CadStatus]?.label || selectedInquiry.status}
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

                    {/* Download button */}
                    {(selectedDesign.hero_image_url || selectedDesign.side_image_url || selectedDesign.top_image_url) && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const urls = [
                            selectedDesign.hero_image_url,
                            selectedDesign.side_image_url,
                            selectedDesign.top_image_url,
                          ].filter(Boolean) as string[];
                          downloadImages(urls);
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Images
                      </Button>
                    )}

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
                      <>
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
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => downloadImages(selectedInquiry.image_urls!)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Images
                        </Button>
                      </>
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
                      {Object.entries(CAD_STATUSES).map(([value, { label }]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
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
                  <label className="text-sm font-medium">Internal Notes (not visible to customer)</label>
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

                {/* Quick Status Workflow Buttons */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Quick Actions</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedInquiry.status === 'new' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => quickStatusUpdate('reviewed', false)}
                      >
                        Mark Reviewed
                      </Button>
                    )}
                    {selectedInquiry.status === 'approved' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => quickStatusUpdate('in_cad')}
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        Start CAD
                      </Button>
                    )}
                    {selectedInquiry.status === 'in_cad' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => quickStatusUpdate('cad_complete')}
                      >
                        CAD Complete
                      </Button>
                    )}
                    {selectedInquiry.status === 'cad_complete' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => quickStatusUpdate('production_ready')}
                      >
                        Production Ready
                      </Button>
                    )}
                    {selectedInquiry.status === 'production_ready' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => quickStatusUpdate('completed')}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Complete
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => quickStatusUpdate('declined', false)}
                    >
                      <XCircle className="w-3 h-3 mr-1" />
                      Decline
                    </Button>
                  </div>
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
