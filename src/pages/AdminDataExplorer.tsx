import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Shield, 
  Database, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  ArrowLeft,
  Loader2,
  Eye
} from "lucide-react";

type TableName = 
  | 'repair_quotes' 
  | 'custom_inquiries' 
  | 'designs' 
  | 'creator_profiles' 
  | 'creator_applications' 
  | 'creator_earnings' 
  | 'user_roles';

const TABLES: { name: TableName; label: string; searchFields: string[] }[] = [
  { name: 'repair_quotes', label: 'Repair Quotes', searchFields: ['id', 'email', 'name', 'status'] },
  { name: 'custom_inquiries', label: 'Custom Inquiries', searchFields: ['id', 'email', 'name', 'status'] },
  { name: 'designs', label: 'Designs', searchFields: ['id', 'title', 'slug', 'status'] },
  { name: 'creator_profiles', label: 'Creator Profiles', searchFields: ['id', 'display_name', 'status'] },
  { name: 'creator_applications', label: 'Creator Applications', searchFields: ['id', 'email', 'name', 'status'] },
  { name: 'creator_earnings', label: 'Creator Earnings', searchFields: ['id', 'status', 'period'] },
  { name: 'user_roles', label: 'User Roles', searchFields: ['id', 'user_id', 'role'] },
];

const PAGE_SIZE = 20;

const AdminDataExplorer = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedTable, setSelectedTable] = useState<TableName>('repair_quotes');
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [tableLoading, setTableLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Record<string, unknown> | null>(null);

  // Admin check
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
  }, []);

  // Fetch table data
  useEffect(() => {
    if (!isAdmin) return;
    
    const fetchData = async () => {
      setTableLoading(true);
      try {
        const tableConfig = TABLES.find(t => t.name === selectedTable);
        const from = page * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        // Get count
        const { count } = await supabase
          .from(selectedTable)
          .select('*', { count: 'exact', head: true });

        setTotalCount(count || 0);

        // Get data
        const { data: rows, error } = await supabase
          .from(selectedTable)
          .select('*')
          .order('created_at', { ascending: false })
          .range(from, to);

        if (error) throw error;
        setData(rows || []);
      } catch (error) {
        console.error('Error fetching table data:', error);
        setData([]);
      } finally {
        setTableLoading(false);
      }
    };

    fetchData();
  }, [isAdmin, selectedTable, page]);

  // Reset page when table changes
  useEffect(() => {
    setPage(0);
    setSearchQuery('');
  }, [selectedTable]);

  // Get columns from data
  const columns = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  // Filter data by search
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    
    const tableConfig = TABLES.find(t => t.name === selectedTable);
    const searchFields = tableConfig?.searchFields || [];
    const query = searchQuery.toLowerCase();

    return data.filter(row => 
      searchFields.some(field => {
        const value = row[field];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(query);
      })
    );
  }, [data, searchQuery, selectedTable]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const formatCellValue = (value: unknown): string => {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'object') return JSON.stringify(value).slice(0, 50) + '...';
    if (typeof value === 'string' && value.length > 50) return value.slice(0, 50) + '...';
    return String(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-service-gold" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-luxury-text-muted" />
          <h1 className="text-2xl font-semibold text-luxury-text mb-2">Access Denied</h1>
          <p className="text-luxury-text-muted">Admins only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-luxury-bg-warm border-r border-luxury-divider flex flex-col">
        <div className="p-4 border-b border-luxury-divider">
          <Link to="/admin" className="flex items-center gap-2 text-sm text-luxury-text-muted hover:text-luxury-text">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h2 className="text-lg font-serif text-luxury-text mt-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-service-gold" />
            Data Explorer
          </h2>
        </div>
        
        <nav className="flex-1 p-2">
          <p className="text-xs text-luxury-text-muted uppercase tracking-wide px-3 py-2">Tables</p>
          {TABLES.map(table => (
            <button
              key={table.name}
              onClick={() => setSelectedTable(table.name)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedTable === table.name
                  ? 'bg-service-gold/10 text-service-gold font-medium'
                  : 'text-luxury-text hover:bg-luxury-divider/50'
              }`}
            >
              {table.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-luxury-divider px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-serif text-luxury-text">
              {TABLES.find(t => t.name === selectedTable)?.label}
            </h1>
            <p className="text-sm text-luxury-text-muted">
              {totalCount} total records
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-text-muted" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 border-luxury-divider"
              />
            </div>
          </div>
        </header>

        {/* Table */}
        <div className="flex-1 overflow-auto p-6">
          <Card className="border-luxury-divider">
            <CardContent className="p-0">
              {tableLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-6 h-6 animate-spin text-service-gold" />
                </div>
              ) : filteredData.length === 0 ? (
                <div className="text-center py-16 text-luxury-text-muted">
                  No data found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-luxury-bg-warm">
                        <TableHead className="w-12 text-luxury-text-muted">View</TableHead>
                        {columns.slice(0, 8).map(col => (
                          <TableHead key={col} className="text-luxury-text-muted font-medium">
                            {col.replace(/_/g, ' ')}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((row, idx) => (
                        <TableRow 
                          key={idx} 
                          className="hover:bg-luxury-bg-warm/50 cursor-pointer"
                          onClick={() => setSelectedRow(row)}
                        >
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-service-gold hover:text-service-gold-hover"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                          {columns.slice(0, 8).map(col => (
                            <TableCell 
                              key={col} 
                              className="text-sm text-luxury-text max-w-[200px] truncate"
                            >
                              {formatCellValue(row[col])}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-luxury-text-muted">
                Page {page + 1} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="border-luxury-divider"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="border-luxury-divider"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Row Detail Modal */}
      <Dialog open={!!selectedRow} onOpenChange={() => setSelectedRow(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] bg-white border-luxury-divider">
          <DialogHeader>
            <DialogTitle className="text-luxury-text font-serif">Row Details</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <pre className="text-xs text-luxury-text bg-luxury-bg-warm p-4 rounded-lg overflow-x-auto">
              {JSON.stringify(selectedRow, null, 2)}
            </pre>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDataExplorer;
