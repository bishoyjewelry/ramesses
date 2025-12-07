import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield } from "lucide-react";
import { AdminApplicationsTab } from "@/components/admin/AdminApplicationsTab";
import { AdminProfilesTab } from "@/components/admin/AdminProfilesTab";
import { AdminDesignsTab } from "@/components/admin/AdminDesignsTab";
import { AdminEarningsTab } from "@/components/admin/AdminEarningsTab";
import { AdminRepairsTab } from "@/components/admin/AdminRepairsTab";

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

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

        // Check if user has admin role
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-luxury-champagne">Loading...</div>
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
      {/* Top Bar */}
      <header className="bg-white border-b border-luxury-divider px-6 py-4">
        <h1 className="text-2xl font-serif text-luxury-text">
          Ramessés Admin Dashboard
        </h1>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <Tabs defaultValue="repairs" className="w-full">
          <TabsList className="mb-6 bg-luxury-bg-warm border border-luxury-divider">
            <TabsTrigger 
              value="repairs"
              className="data-[state=active]:bg-luxury-champagne data-[state=active]:text-luxury-text"
            >
              Repairs
            </TabsTrigger>
            <TabsTrigger 
              value="applications"
              className="data-[state=active]:bg-luxury-champagne data-[state=active]:text-luxury-text"
            >
              Creator Applications
            </TabsTrigger>
            <TabsTrigger 
              value="profiles"
              className="data-[state=active]:bg-luxury-champagne data-[state=active]:text-luxury-text"
            >
              Creator Profiles
            </TabsTrigger>
            <TabsTrigger 
              value="designs"
              className="data-[state=active]:bg-luxury-champagne data-[state=active]:text-luxury-text"
            >
              Designs
            </TabsTrigger>
            <TabsTrigger 
              value="earnings"
              className="data-[state=active]:bg-luxury-champagne data-[state=active]:text-luxury-text"
            >
              Earnings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="repairs">
            <AdminRepairsTab />
          </TabsContent>

          <TabsContent value="applications">
            <AdminApplicationsTab />
          </TabsContent>

          <TabsContent value="profiles">
            <AdminProfilesTab />
          </TabsContent>

          <TabsContent value="designs">
            <AdminDesignsTab />
          </TabsContent>

          <TabsContent value="earnings">
            <AdminEarningsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;