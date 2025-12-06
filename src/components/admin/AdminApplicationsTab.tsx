import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { SimpleSelect } from "@/components/SimpleSelect";
import type { Database } from "@/integrations/supabase/types";

type ApplicationStatus = Database["public"]["Enums"]["application_status"];
type Application = Database["public"]["Tables"]["creator_applications"]["Row"];

export const AdminApplicationsTab = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchApplications = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('creator_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq('status', statusFilter as ApplicationStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const handleApprove = async (application: Application) => {
    try {
      // Update application status
      const { error: updateError } = await supabase
        .from('creator_applications')
        .update({ status: 'approved' as ApplicationStatus })
        .eq('id', application.id);

      if (updateError) throw updateError;

      // Check if creator profile already exists for this user
      const { data: existingProfile } = await supabase
        .from('creator_profiles')
        .select('id')
        .eq('user_id', application.user_id)
        .maybeSingle();

      if (!existingProfile) {
        // Create creator profile
        const { error: profileError } = await supabase
          .from('creator_profiles')
          .insert({
            user_id: application.user_id,
            display_name: application.name,
            status: 'active',
          });

        if (profileError) throw profileError;

        // Update user role to creator
        const { error: roleError } = await supabase
          .from('user_roles')
          .upsert({
            user_id: application.user_id,
            role: 'creator',
          }, { onConflict: 'user_id,role' });

        if (roleError) {
          console.error('Error updating role:', roleError);
        }
      }

      // TODO: Call Edge Function to send "Creator Approved" email
      // await supabase.functions.invoke('send-creator-approved-email', { body: { email: application.email, name: application.name } });

      toast.success('Application approved successfully');
      fetchApplications();
    } catch (error) {
      console.error('Error approving application:', error);
      toast.error('Failed to approve application');
    }
  };

  const handleReject = async (application: Application) => {
    try {
      const { error } = await supabase
        .from('creator_applications')
        .update({ status: 'rejected' as ApplicationStatus })
        .eq('id', application.id);

      if (error) throw error;

      // TODO: Call Edge Function to send "Application Rejected" email
      // await supabase.functions.invoke('send-application-rejected-email', { body: { email: application.email, name: application.name } });

      toast.success('Application rejected');
      fetchApplications();
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast.error('Failed to reject application');
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    const colors: Record<ApplicationStatus, string> = {
      new: 'bg-blue-100 text-blue-800',
      under_review: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return <Badge className={colors[status]}>{status}</Badge>;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-luxury-text border-b-2 border-luxury-champagne pb-2">
          Creator Applications
        </h2>
        <div className="w-48">
          <SimpleSelect
            value={statusFilter}
            onValueChange={setStatusFilter}
            placeholder="Filter by status"
            options={[
              { value: "all", label: "All" },
              { value: "new", label: "New" },
              { value: "under_review", label: "Under Review" },
              { value: "approved", label: "Approved" },
              { value: "rejected", label: "Rejected" },
            ]}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-luxury-text-muted">Loading...</div>
      ) : applications.length === 0 ? (
        <div className="text-center py-8 text-luxury-text-muted">No applications found</div>
      ) : (
        <div className="border border-luxury-divider rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-luxury-bg-warm">
                <TableHead className="text-luxury-text font-semibold">ID</TableHead>
                <TableHead className="text-luxury-text font-semibold">Name</TableHead>
                <TableHead className="text-luxury-text font-semibold">Email</TableHead>
                <TableHead className="text-luxury-text font-semibold">Status</TableHead>
                <TableHead className="text-luxury-text font-semibold">Created</TableHead>
                <TableHead className="text-luxury-text font-semibold">Notes</TableHead>
                <TableHead className="text-luxury-text font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id} className="hover:bg-luxury-bg-warm/50">
                  <TableCell className="text-xs text-luxury-text-muted font-mono">
                    {app.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="text-luxury-text">{app.name}</TableCell>
                  <TableCell className="text-luxury-text">{app.email}</TableCell>
                  <TableCell>{getStatusBadge(app.status)}</TableCell>
                  <TableCell className="text-luxury-text-muted text-sm">
                    {new Date(app.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-luxury-text-muted text-sm max-w-xs truncate">
                    {app.notes || '-'}
                  </TableCell>
                  <TableCell>
                    {app.status === 'new' || app.status === 'under_review' ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(app)}
                          className="bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(app)}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-luxury-text-muted text-sm">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};