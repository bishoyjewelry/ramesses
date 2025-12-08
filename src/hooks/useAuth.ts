import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isCreator: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isCreator: false,
  });

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          isLoading: false,
        }));

        // After auth change, link guest repairs and check creator status
        if (session?.user) {
          setTimeout(() => {
            // Link any guest repairs to this user
            if (session.user.email) {
              linkGuestRepairs(session.user.id, session.user.email);
            }
            checkCreatorStatus(session.user.id);
          }, 0);
        } else {
          setAuthState(prev => ({ ...prev, isCreator: false }));
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
        isLoading: false,
      }));

      if (session?.user) {
        // Link any guest repairs to this user
        if (session.user.email) {
          linkGuestRepairs(session.user.id, session.user.email);
        }
        checkCreatorStatus(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const linkGuestRepairs = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase.rpc('link_guest_repairs', {
        _user_id: userId,
        _email: email,
      });
      
      if (error) {
        console.error('Error linking guest repairs:', error);
      } else if (data && data > 0) {
        console.log(`Linked ${data} guest repair(s) to user account`);
      }
    } catch (error) {
      console.error('Error linking guest repairs:', error);
    }
  };

  const checkCreatorStatus = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('creator_profiles')
        .select('id, status')
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle();

      setAuthState(prev => ({ ...prev, isCreator: !!data }));
    } catch (error) {
      console.error('Error checking creator status:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
  };
};
