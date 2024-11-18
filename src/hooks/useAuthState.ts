import { useState } from "react";
import { User } from "@supabase/supabase-js";
import Gleap from "gleap";
import { supabase } from "@/integrations/supabase/client";

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const identifyUserInGleap = async (currentUser: User | null) => {
    if (currentUser) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', currentUser.id)
        .single();

      const fullName = profile 
        ? `${profile.first_name} ${profile.last_name}`.trim() 
        : currentUser.email?.split('@')[0] || 'User';
      
      Gleap.identify(currentUser.id, {
        email: currentUser.email,
        name: fullName,
      });
    } else {
      Gleap.clearIdentity();
    }
  };

  return {
    user,
    setUser,
    session,
    setSession,
    isLoading,
    setIsLoading,
    identifyUserInGleap
  };
};