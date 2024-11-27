import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { ProfileType } from "./types";
import { handleAnalytics, handleGleapIdentification } from "./analytics";
import { getRoleBasedRedirectPath } from "@/lib/roleRedirection";

export const handleUserSession = async (
  user: User | null,
  isInitialLogin = false,
  setUser: (user: User | null) => void,
  navigate: (path: string) => void
) => {
  try {
    if (!user) {
      setUser(null);
      return;
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('onboarding_completed, role, first_name, last_name')
      .eq('id', user.id)
      .single();

    if (error) throw error;

    setUser(user);
    
    handleGleapIdentification(user, profile as ProfileType);
    handleAnalytics(user, profile as ProfileType);

    if (isInitialLogin) {
      if (!profile?.onboarding_completed) {
        navigate('/onboarding');
      } else {
        const redirectPath = getRoleBasedRedirectPath(profile?.role);
        navigate(redirectPath);
      }
    }
  } catch (error) {
    console.error('Error in handleUserSession:', error);
    setUser(null);
  }
};