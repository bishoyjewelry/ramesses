import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type EarningStatus = Database["public"]["Enums"]["earning_status"];
type CreatorEarning = Database["public"]["Tables"]["creator_earnings"]["Row"];

interface EarningWithDetails extends CreatorEarning {
  creator_profiles?: { display_name: string } | null;
  designs?: { title: string } | null;
}

export const AdminEarningsTab = () => {
  const [earnings, setEarnings] = useState<EarningWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalSales: 0,
    totalCommissions: 0,
  });

  const fetchEarnings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('creator_earnings')
        .select(`
          *,
          creator_profiles (display_name),
          designs (title)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEarnings(data || []);

      // Calculate summary for last month
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      
      const lastMonthEarnings = (data || []).filter(
        e => new Date(e.created_at) >= lastMonth
      );

      const totalSales = lastMonthEarnings.reduce((sum, e) => sum + Number(e.sale_amount), 0);
      const totalCommissions = lastMonthEarnings.reduce((sum, e) => sum + Number(e.commission_amount), 0);

      setSummary({ totalSales, totalCommissions });
    } catch (error) {
      console.error('Error fetching earnings:', error);
      toast.error('Failed to load earnings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  const getStatusBadge = (status: EarningStatus) => {
    const colors: Record<EarningStatus, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      ready_to_pay: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      void: 'bg-gray-100 text-gray-800',
    };
    return <Badge className={colors[status]}>{status.replace('_', ' ')}</Badge>;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-luxury-text border-b-2 border-luxury-champagne pb-2">
          Creator Earnings
        </h2>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Card className="border border-luxury-divider">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-luxury-champagne/20 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-luxury-champagne" />
              </div>
              <div>
                <p className="text-sm text-luxury-text-muted">Last Month Sales</p>
                <p className="text-2xl font-semibold text-luxury-text">
                  ${summary.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-luxury-divider">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-luxury-champagne/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-luxury-champagne" />
              </div>
              <div>
                <p className="text-sm text-luxury-text-muted">Last Month Commissions</p>
                <p className="text-2xl font-semibold text-luxury-text">
                  ${summary.totalCommissions.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="text-center py-8 text-luxury-text-muted">Loading...</div>
      ) : earnings.length === 0 ? (
        <div className="text-center py-8 text-luxury-text-muted">No earnings records found</div>
      ) : (
        <div className="border border-luxury-divider rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-luxury-bg-warm">
                <TableHead className="text-luxury-text font-semibold">Creator</TableHead>
                <TableHead className="text-luxury-text font-semibold">Design</TableHead>
                <TableHead className="text-luxury-text font-semibold">Order ID</TableHead>
                <TableHead className="text-luxury-text font-semibold">Sale Amount</TableHead>
                <TableHead className="text-luxury-text font-semibold">Commission</TableHead>
                <TableHead className="text-luxury-text font-semibold">Status</TableHead>
                <TableHead className="text-luxury-text font-semibold">Period</TableHead>
                <TableHead className="text-luxury-text font-semibold">Paid At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {earnings.map((earning) => (
                <TableRow key={earning.id} className="hover:bg-luxury-bg-warm/50">
                  <TableCell className="text-luxury-text font-medium">
                    {earning.creator_profiles?.display_name || '-'}
                  </TableCell>
                  <TableCell className="text-luxury-text-muted">
                    {earning.designs?.title || '-'}
                  </TableCell>
                  <TableCell className="text-xs text-luxury-text-muted font-mono">
                    {earning.order_id || '-'}
                  </TableCell>
                  <TableCell className="text-luxury-text">
                    ${Number(earning.sale_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-green-600 font-medium">
                    ${Number(earning.commission_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>{getStatusBadge(earning.status)}</TableCell>
                  <TableCell className="text-luxury-text-muted text-sm">
                    {earning.period}
                  </TableCell>
                  <TableCell className="text-luxury-text-muted text-sm">
                    {earning.paid_at ? new Date(earning.paid_at).toLocaleDateString() : '-'}
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