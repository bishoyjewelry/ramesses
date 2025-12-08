import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { toast } from "sonner";
import { 
  Shield, 
  Users, 
  Search, 
  ArrowLeft,
  Loader2,
  UserCog,
  Activity,
  Wrench,
  Gem,
  Palette,
  DollarSign
} from "lucide-react";
import { format } from "date-fns";

interface UserWithRole {
  id: string;
  email: string;
  created_at: string;
  role: string;
  last_sign_in_at: string | null;
}

interface UserActivity {
  repairs: number;
  customRequests: number;
  designs: number;
  totalCommission: number;
}

const AdminUsers = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [newRole, setNewRole] = useState('');
  const [roleUpdating, setRoleUpdating] = useState(false);
  
  const [activityUser, setActivityUser] = useState<UserWithRole | null>(null);
  const [userActivity, setUserActivity] = useState<UserActivity | null>(null);
  const [activityLoading, setActivityLoading] = useState(false);

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

  // Fetch users
  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-admin-users');
      
      if (error) throw error;
      setUsers(data?.users || []);
    } catch (error: unknown) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  const handleRoleChange = async () => {
    if (!selectedUser || !newRole) return;
    
    setRoleUpdating(true);
    try {
      const { data, error } = await supabase.functions.invoke('update-user-role', {
        body: { user_id: selectedUser.id, role: newRole }
      });
      
      if (error) throw error;
      
      toast.success(`Role updated to ${newRole}`);
      setSelectedUser(null);
      setNewRole('');
      loadUsers();
    } catch (error: unknown) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
    } finally {
      setRoleUpdating(false);
    }
  };

  const loadUserActivity = async (targetUser: UserWithRole) => {
    setActivityUser(targetUser);
    setActivityLoading(true);
    setUserActivity(null);
    
    try {
      // Get repairs count
      const { count: repairsCount } = await supabase
        .from('repair_quotes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', targetUser.id);

      // Get custom requests count
      const { count: customCount } = await supabase
        .from('custom_inquiries')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', targetUser.id);

      // Get creator profile if exists
      const { data: profile } = await supabase
        .from('creator_profiles')
        .select('id')
        .eq('user_id', targetUser.id)
        .maybeSingle();

      let designsCount = 0;
      let totalCommission = 0;

      if (profile) {
        const { count } = await supabase
          .from('designs')
          .select('*', { count: 'exact', head: true })
          .eq('creator_profile_id', profile.id);
        
        designsCount = count || 0;

        const { data: earnings } = await supabase
          .from('creator_earnings')
          .select('commission_amount')
          .eq('creator_profile_id', profile.id);

        totalCommission = earnings?.reduce((sum, e) => sum + Number(e.commission_amount), 0) || 0;
      }

      setUserActivity({
        repairs: repairsCount || 0,
        customRequests: customCount || 0,
        designs: designsCount,
        totalCommission
      });
    } catch (error) {
      console.error('Error loading activity:', error);
      toast.error('Failed to load user activity');
    } finally {
      setActivityLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
      admin: { bg: 'bg-red-100', text: 'text-red-700' },
      creator: { bg: 'bg-purple-100', text: 'text-purple-700' },
      customer: { bg: 'bg-blue-100', text: 'text-blue-700' },
      none: { bg: 'bg-gray-100', text: 'text-gray-500' },
    };
    const style = styles[role] || styles.none;
    return (
      <Badge className={`${style.bg} ${style.text} border-0 capitalize`}>
        {role}
      </Badge>
    );
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-luxury-divider px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="flex items-center gap-2 text-sm text-luxury-text-muted hover:text-luxury-text">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <div className="h-6 w-px bg-luxury-divider" />
            <h1 className="text-xl font-serif text-luxury-text flex items-center gap-2">
              <Users className="w-5 h-5 text-service-gold" />
              User Management
            </h1>
          </div>
          <p className="text-sm text-luxury-text-muted">
            {users.length} registered users
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-text-muted" />
            <Input
              placeholder="Search by email, ID, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-luxury-divider"
            />
          </div>
        </div>

        {/* Users Table */}
        <Card className="border-luxury-divider">
          <CardContent className="p-0">
            {usersLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-service-gold" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-16 text-luxury-text-muted">
                No users found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-luxury-bg-warm">
                      <TableHead className="text-luxury-text-muted font-medium">User ID</TableHead>
                      <TableHead className="text-luxury-text-muted font-medium">Email</TableHead>
                      <TableHead className="text-luxury-text-muted font-medium">Created</TableHead>
                      <TableHead className="text-luxury-text-muted font-medium">Last Sign In</TableHead>
                      <TableHead className="text-luxury-text-muted font-medium">Role</TableHead>
                      <TableHead className="text-luxury-text-muted font-medium text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((u) => (
                      <TableRow key={u.id} className="hover:bg-luxury-bg-warm/50">
                        <TableCell className="font-mono text-xs text-luxury-text-muted">
                          {u.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell className="text-luxury-text">{u.email}</TableCell>
                        <TableCell className="text-sm text-luxury-text-muted">
                          {format(new Date(u.created_at), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="text-sm text-luxury-text-muted">
                          {u.last_sign_in_at 
                            ? format(new Date(u.last_sign_in_at), 'MMM d, yyyy h:mm a')
                            : '—'}
                        </TableCell>
                        <TableCell>{getRoleBadge(u.role)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(u);
                                setNewRole(u.role);
                              }}
                              className="text-service-gold hover:text-service-gold-hover"
                            >
                              <UserCog className="w-4 h-4 mr-1" />
                              Role
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => loadUserActivity(u)}
                              className="text-luxury-text-muted hover:text-luxury-text"
                            >
                              <Activity className="w-4 h-4 mr-1" />
                              Activity
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Change Role Modal */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="bg-white border-luxury-divider">
          <DialogHeader>
            <DialogTitle className="text-luxury-text font-serif">Change User Role</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm text-luxury-text-muted mb-1">User</p>
              <p className="text-luxury-text font-medium">{selectedUser?.email}</p>
            </div>
            
            <div>
              <p className="text-sm text-luxury-text-muted mb-2">New Role</p>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger className="border-luxury-divider">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="creator">Creator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="none">None (Remove role)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setSelectedUser(null)}
              className="border-luxury-divider"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRoleChange}
              disabled={roleUpdating || !newRole}
              className="bg-service-gold text-white hover:bg-service-gold-hover"
            >
              {roleUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Activity Modal */}
      <Dialog open={!!activityUser} onOpenChange={() => setActivityUser(null)}>
        <DialogContent className="bg-white border-luxury-divider">
          <DialogHeader>
            <DialogTitle className="text-luxury-text font-serif">User Activity</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-luxury-text-muted mb-4">{activityUser?.email}</p>
            
            {activityLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-service-gold" />
              </div>
            ) : userActivity ? (
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-luxury-divider">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Wrench className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-luxury-text">{userActivity.repairs}</p>
                      <p className="text-xs text-luxury-text-muted">Repairs</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-luxury-divider">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Gem className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-luxury-text">{userActivity.customRequests}</p>
                      <p className="text-xs text-luxury-text-muted">Custom Requests</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-luxury-divider">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Palette className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-luxury-text">{userActivity.designs}</p>
                      <p className="text-xs text-luxury-text-muted">Designs</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-luxury-divider">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-luxury-text">
                        ${userActivity.totalCommission.toFixed(2)}
                      </p>
                      <p className="text-xs text-luxury-text-muted">Total Commission</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
