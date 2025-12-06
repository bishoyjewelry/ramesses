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
import { Check, Archive, Star, StarOff, Edit2, Save, X } from "lucide-react";
import { SimpleSelect } from "@/components/SimpleSelect";
import type { Database } from "@/integrations/supabase/types";

type DesignStatus = Database["public"]["Enums"]["design_status"];
type DesignCategory = Database["public"]["Enums"]["design_category"];
type CommissionType = Database["public"]["Enums"]["commission_type"];
type Design = Database["public"]["Tables"]["designs"]["Row"];

interface DesignWithCreator extends Design {
  creator_profiles?: { display_name: string } | null;
}

export const AdminDesignsTab = () => {
  const [designs, setDesigns] = useState<DesignWithCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Design>>({});

  const fetchDesigns = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('designs')
        .select(`
          *,
          creator_profiles (display_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDesigns(data || []);
    } catch (error) {
      console.error('Error fetching designs:', error);
      toast.error('Failed to load designs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigns();
  }, []);

  const handleUpdateStatus = async (designId: string, newStatus: DesignStatus) => {
    try {
      const { error } = await supabase
        .from('designs')
        .update({ status: newStatus })
        .eq('id', designId);

      if (error) throw error;

      toast.success(`Design status updated to ${newStatus}`);
      fetchDesigns();
    } catch (error) {
      console.error('Error updating design status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleToggleFeatured = async (designId: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('designs')
        .update({ is_featured: !currentValue })
        .eq('id', designId);

      if (error) throw error;

      toast.success(currentValue ? 'Design unfeatured' : 'Design featured');
      fetchDesigns();
    } catch (error) {
      console.error('Error toggling featured:', error);
      toast.error('Failed to update featured status');
    }
  };

  const startEditing = (design: Design) => {
    setEditingId(design.id);
    setEditData({
      title: design.title,
      base_price: design.base_price,
      category: design.category,
      commission_type: design.commission_type,
      commission_value: design.commission_value,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEditing = async (designId: string) => {
    try {
      const { error } = await supabase
        .from('designs')
        .update(editData)
        .eq('id', designId);

      if (error) throw error;

      toast.success('Design updated');
      setEditingId(null);
      setEditData({});
      fetchDesigns();
    } catch (error) {
      console.error('Error saving design:', error);
      toast.error('Failed to save changes');
    }
  };

  const getStatusBadge = (status: DesignStatus) => {
    const colors: Record<DesignStatus, string> = {
      draft: 'bg-gray-100 text-gray-800',
      pending_approval: 'bg-yellow-100 text-yellow-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return <Badge className={colors[status]}>{status.replace('_', ' ')}</Badge>;
  };

  const categoryOptions = [
    { value: 'ring', label: 'Ring' },
    { value: 'pendant', label: 'Pendant' },
    { value: 'chain', label: 'Chain' },
    { value: 'bracelet', label: 'Bracelet' },
    { value: 'earrings', label: 'Earrings' },
    { value: 'other', label: 'Other' },
  ];

  const commissionTypeOptions = [
    { value: 'percentage', label: 'Percentage' },
    { value: 'fixed', label: 'Fixed' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-luxury-text border-b-2 border-luxury-champagne pb-2">
          Designs
        </h2>
      </div>

      {loading ? (
        <div className="text-center py-8 text-luxury-text-muted">Loading...</div>
      ) : designs.length === 0 ? (
        <div className="text-center py-8 text-luxury-text-muted">No designs found</div>
      ) : (
        <div className="border border-luxury-divider rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-luxury-bg-warm">
                <TableHead className="text-luxury-text font-semibold">ID</TableHead>
                <TableHead className="text-luxury-text font-semibold">Title</TableHead>
                <TableHead className="text-luxury-text font-semibold">Creator</TableHead>
                <TableHead className="text-luxury-text font-semibold">Category</TableHead>
                <TableHead className="text-luxury-text font-semibold">Base Price</TableHead>
                <TableHead className="text-luxury-text font-semibold">Commission</TableHead>
                <TableHead className="text-luxury-text font-semibold">Status</TableHead>
                <TableHead className="text-luxury-text font-semibold">Featured</TableHead>
                <TableHead className="text-luxury-text font-semibold">Created</TableHead>
                <TableHead className="text-luxury-text font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {designs.map((design) => (
                <TableRow key={design.id} className="hover:bg-luxury-bg-warm/50">
                  <TableCell className="text-xs text-luxury-text-muted font-mono">
                    {design.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    {editingId === design.id ? (
                      <Input
                        value={editData.title || ''}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        className="w-32 h-8 text-sm"
                      />
                    ) : (
                      <span className="text-luxury-text font-medium">{design.title}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-luxury-text-muted">
                    {design.creator_profiles?.display_name || '-'}
                  </TableCell>
                  <TableCell>
                    {editingId === design.id ? (
                      <div className="w-28">
                        <SimpleSelect
                          value={editData.category || ''}
                          onValueChange={(val) => setEditData({ ...editData, category: val as DesignCategory })}
                          options={categoryOptions}
                        />
                      </div>
                    ) : (
                      <span className="text-luxury-text">{design.category}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === design.id ? (
                      <Input
                        type="number"
                        value={editData.base_price || 0}
                        onChange={(e) => setEditData({ ...editData, base_price: parseFloat(e.target.value) })}
                        className="w-24 h-8 text-sm"
                      />
                    ) : (
                      <span className="text-luxury-text">${design.base_price}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === design.id ? (
                      <div className="flex gap-1 items-center">
                        <Input
                          type="number"
                          value={editData.commission_value || 0}
                          onChange={(e) => setEditData({ ...editData, commission_value: parseFloat(e.target.value) })}
                          className="w-16 h-8 text-sm"
                        />
                        <div className="w-24">
                          <SimpleSelect
                            value={editData.commission_type || ''}
                            onValueChange={(val) => setEditData({ ...editData, commission_type: val as CommissionType })}
                            options={commissionTypeOptions}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-luxury-text-muted text-sm">
                        {design.commission_value}{design.commission_type === 'percentage' ? '%' : '$'}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(design.status)}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleFeatured(design.id, design.is_featured)}
                      className={design.is_featured ? 'text-yellow-600' : 'text-gray-400'}
                    >
                      {design.is_featured ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                    </Button>
                  </TableCell>
                  <TableCell className="text-luxury-text-muted text-sm">
                    {new Date(design.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {editingId === design.id ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => saveEditing(design.id)}
                            className="bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover"
                          >
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelEditing}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEditing(design)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          {design.status !== 'published' && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateStatus(design.id, 'published')}
                              className="bg-green-600 text-white hover:bg-green-700"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          {design.status !== 'archived' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(design.id, 'archived')}
                            >
                              <Archive className="w-4 h-4" />
                            </Button>
                          )}
                        </>
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