import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Search, UserCheck, UserX } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type CreatorStatus = Database["public"]["Enums"]["creator_status"];
type CreatorProfile = Database["public"]["Tables"]["creator_profiles"]["Row"];

export const AdminProfilesTab = () => {
  const [profiles, setProfiles] = useState<CreatorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('creator_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast.error('Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleSetStatus = async (profileId: string, newStatus: CreatorStatus) => {
    try {
      const { error } = await supabase
        .from('creator_profiles')
        .update({ status: newStatus })
        .eq('id', profileId);

      if (error) throw error;

      toast.success(`Profile status updated to ${newStatus}`);
      fetchProfiles();
    } catch (error) {
      console.error('Error updating profile status:', error);
      toast.error('Failed to update status');
    }
  };

  const getStatusBadge = (status: CreatorStatus) => {
    const colors: Record<CreatorStatus, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-red-100 text-red-800',
    };
    return <Badge className={colors[status]}>{status}</Badge>;
  };

  const filteredProfiles = profiles.filter(profile =>
    profile.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.bio?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-luxury-text border-b-2 border-luxury-champagne pb-2">
          Creator Profiles
        </h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-text-muted" />
          <Input
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-luxury-divider"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-luxury-text-muted">Loading...</div>
      ) : filteredProfiles.length === 0 ? (
        <div className="text-center py-8 text-luxury-text-muted">No profiles found</div>
      ) : (
        <div className="border border-luxury-divider rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-luxury-bg-warm">
                <TableHead className="text-luxury-text font-semibold">ID</TableHead>
                <TableHead className="text-luxury-text font-semibold">Display Name</TableHead>
                <TableHead className="text-luxury-text font-semibold">Location</TableHead>
                <TableHead className="text-luxury-text font-semibold">Status</TableHead>
                <TableHead className="text-luxury-text font-semibold">Created</TableHead>
                <TableHead className="text-luxury-text font-semibold">Updated</TableHead>
                <TableHead className="text-luxury-text font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfiles.map((profile) => (
                <TableRow key={profile.id} className="hover:bg-luxury-bg-warm/50">
                  <TableCell className="text-xs text-luxury-text-muted font-mono">
                    {profile.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="text-luxury-text font-medium">
                    {profile.display_name}
                  </TableCell>
                  <TableCell className="text-luxury-text-muted">
                    {profile.location || '-'}
                  </TableCell>
                  <TableCell>{getStatusBadge(profile.status)}</TableCell>
                  <TableCell className="text-luxury-text-muted text-sm">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-luxury-text-muted text-sm">
                    {new Date(profile.updated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {profile.status !== 'active' && (
                        <Button
                          size="sm"
                          onClick={() => handleSetStatus(profile.id, 'active')}
                          className="bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover"
                        >
                          <UserCheck className="w-4 h-4 mr-1" />
                          Activate
                        </Button>
                      )}
                      {profile.status !== 'suspended' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSetStatus(profile.id, 'suspended')}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <UserX className="w-4 h-4 mr-1" />
                          Suspend
                        </Button>
                      )}
                    </div>
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