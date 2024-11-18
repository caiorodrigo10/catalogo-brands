import { Link, useLocation, useNavigate } from "react-router-dom";
import UserMenu from "./UserMenu";
import { Menu, LayoutDashboard, FolderGit2, Grid3X3, Palette, Calculator, Package2 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useUserPermissions } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { toast } from "sonner";

export const NavigationMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasFullAccess } = useUserPermissions();

  const menuItems = [
    { 
      label: "Dashboard", 
      path: "/dashboard", 
      icon: LayoutDashboard,
      restricted: true
    },
    { 
      label: "Projects", 
      path: "/projects", 
      icon: FolderGit2,
      restricted: true
    },
    { 
      label: "Catalog", 
      path: "/catalog", 
      icon: Grid3X3,
      restricted: false
    },
    { 
      label: "My Products", 
      path: "/products", 
      icon: Palette,
      restricted: true
    },
    { 
      label: "Orders", 
      path: "/sample-orders", 
      icon: Package2,
      restricted: false
    },
    { 
      label: "Profit Calculator", 
      path: "/profit-calculator", 
      icon: Calculator,
      restricted: false
    },
  ];

  const handleRestrictedNavigation = (path: string) => {
    if (!hasFullAccess) {
      toast.error("You need to upgrade your plan to access this feature");
      navigate("/checkout/points");
      return;
    }
    navigate(path);
  };

  const renderMenuItem = (item: typeof menuItems[0], mobile: boolean = false) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;
    const baseStyles = cn(
      "flex items-center gap-3 px-4 py-2.5 my-1 text-sm rounded-md transition-all duration-200",
      isActive
        ? "bg-[#2c2c2c] text-white font-medium"
        : "text-gray-300 hover:bg-[#2c2c2c] hover:text-white",
      item.restricted && !hasFullAccess && "opacity-50 cursor-not-allowed"
    );

    if (item.restricted && !hasFullAccess) {
      return (
        <button
          key={item.path}
          className={baseStyles}
          onClick={() => handleRestrictedNavigation(item.path)}
        >
          <Icon className="h-4 w-4" />
          {item.label}
        </button>
      );
    }

    return (
      <Link
        key={item.path}
        to={item.path}
        className={baseStyles}
      >
        <Icon className="h-4 w-4" />
        {item.label}
      </Link>
    );
  };

  return (
    <>
      {/* Desktop Menu - Vertical */}
      <header className="border-r border-border/40 bg-[#131313] fixed left-0 top-0 h-screen hidden md:block w-64">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <img 
              src="https://content.app-sources.com/s/97257455971736356/uploads/Logos/Logotipo_4-7282325.png?format=webp"
              alt="Mainer Logo"
              className="h-8 w-auto"
            />
          </div>
          
          <nav className="flex-1 px-3">
            {menuItems.map(item => renderMenuItem(item))}
          </nav>

          <div className="p-4 border-t border-border/40">
            <UserMenu isMobile={false} />
          </div>
        </div>
      </header>

      {/* Mobile Menu - Horizontal */}
      <header className="md:hidden fixed top-0 left-0 right-0 border-b border-border/40 bg-[#131313]">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <img 
                src="https://content.app-sources.com/s/97257455971736356/uploads/Logos/Logotipo_4-7282325.png?format=webp"
                alt="Mainer Logo"
                className="h-8 w-auto"
              />
            </div>

            <Sheet>
              <SheetTrigger>
                <Menu className="h-6 w-6 text-gray-300" />
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-[#131313] p-0">
                <div className="flex flex-col">
                  <div className="p-4 border-b border-gray-800">
                    <UserMenu isMobile={true} />
                  </div>
                  <nav className="flex flex-col p-4">
                    {menuItems.map(item => renderMenuItem(item, true))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
};