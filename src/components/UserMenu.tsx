import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface UserMenuProps {
  isMobile: boolean;
}

const UserMenu = ({ isMobile }: UserMenuProps) => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  const { data: totalPoints } = useQuery({
    queryKey: ["userPoints", user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      const { data: projects } = await supabase
        .from("projects")
        .select("points, points_used")
        .eq("user_id", user.id);

      if (!projects) return 0;
      
      return projects.reduce((acc, project) => {
        return acc + (project.points - (project.points_used || 0));
      }, 0);
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from("profiles")
      .select()
      .eq("id", user.id)
      .single();
      
    if (data) {
      setProfile(data);
    }
  };

  if (!user) return null;

  const userEmail = user.email || "";
  const userName = profile ? `${profile.first_name} ${profile.last_name}`.trim() : userEmail?.split("@")[0] || "User";
  const userAvatar = profile?.avatar_url;

  if (isMobile) {
    return (
      <div className="flex flex-col">
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-semibold text-white">{totalPoints?.toLocaleString() || 0} pts</span>
            <Link 
              to="/packages"
              className="text-sm bg-primary hover:bg-primary/90 text-white px-4 py-1.5 rounded-full"
            >
              View Packages
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10 border border-white/20">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {userName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">{userName}</span>
            <span className="text-xs text-white/70">{userEmail}</span>
          </div>
        </div>
        <div className="flex flex-col space-y-1">
          <Link 
            to="/profile" 
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-md"
          >
            <User className="h-4 w-4" />
            <span>My Profile</span>
          </Link>
          <Link 
            to="/sample-orders" 
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-md"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Orders</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-gray-800 rounded-md w-full text-left"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-auto w-full flex flex-col items-start gap-1 px-3 py-2 hover:bg-white/10"
        >
          <div className="bg-gray-800 w-full rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-white">{totalPoints?.toLocaleString() || 0} pts</span>
              <Link 
                to="/packages"
                className="text-sm bg-primary hover:bg-primary/90 text-white px-4 py-1.5 rounded-full"
              >
                View Packages
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full">
            <Avatar className="h-8 w-8 border border-white/20">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {userName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium text-white">{userName}</span>
              <span className="text-xs text-white/70">{userEmail}</span>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-64 bg-white rounded-lg shadow-lg border border-gray-200" 
        align="end"
      >
        <DropdownMenuLabel className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {userName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500">{userEmail}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-100" />
        <div className="p-1">
          <Link to="/profile">
            <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 rounded-md">
              <User className="h-4 w-4 text-gray-500" />
              <span>My Profile</span>
            </DropdownMenuItem>
          </Link>
          <Link to="/sample-orders">
            <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 rounded-md">
              <ShoppingBag className="h-4 w-4 text-gray-500" />
              <span>Orders</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem 
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 text-red-600 rounded-md"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;