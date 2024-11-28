import { Link, useLocation, useNavigate } from "react-router-dom";
import UserMenu from "./UserMenu";
import { Menu, LayoutDashboard, FolderGit2, Grid3X3, Palette, Calculator, Package2, PlayCircle } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useUserPermissions } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { ProjectPointsInfo } from "./navigation/ProjectPointsInfo";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";

export const NavigationMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasFullAccess, isMember, isSampler } = useUserPermissions();
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const showStartHere = isMember || isSampler;

  // Helper function to get language-prefixed path
  const getPrefixedPath = (path: string) => {
    return `/${i18n.language}${path}`;
  };

  // Helper function to check if a path is active
  const isPathActive = (path: string) => {
    const currentPath = location.pathname.replace(`/${i18n.language}`, '');
    return currentPath === path;
  };

  const menuItems = [
    { 
      label: t('navigation.dashboard'), 
      path: "/dashboard", 
      icon: LayoutDashboard,
      restricted: false
    },
    { 
      label: t('navigation.projects'), 
      path: "/projects", 
      icon: FolderGit2,
      restricted: true
    },
    { 
      label: t('navigation.products'), 
      path: "/products", 
      icon: Grid3X3,
      restricted: true
    },
    { 
      label: t('navigation.catalog'), 
      path: "/catalog", 
      icon: Palette,
      restricted: false
    },
    { 
      label: t('navigation.profitCalculator'), 
      path: "/profit-calculator", 
      icon: Calculator,
      restricted: false
    },
    { 
      label: t('navigation.sampleOrders'), 
      path: "/sample-orders", 
      icon: Package2,
      restricted: false
    },
    ...(showStartHere ? [
      { 
        label: t('navigation.getStarted'), 
        path: "/start-here", 
        icon: PlayCircle,
        restricted: false
      }
    ] : []),
  ];

  const handleRestrictedNavigation = (path: string) => {
    if (!hasFullAccess) {
      navigate(getPrefixedPath("/start-here"));
      setIsOpen(false);
      return;
    }
    navigate(getPrefixedPath(path));
    setIsOpen(false);
  };

  const renderMenuItem = (item: typeof menuItems[0], mobile: boolean = false) => {
    const Icon = item.icon;
    const isActive = isPathActive(item.path);
    const prefixedPath = getPrefixedPath(item.path);
    
    const baseStyles = cn(
      "flex items-center gap-3 px-4 py-2.5 my-1 text-sm rounded-md transition-all duration-200",
      isActive
        ? "bg-[#fff4fc] text-black font-medium"
        : "text-black hover:bg-[#fff4fc] hover:text-black",
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

    if (mobile) {
      return (
        <button
          key={item.path}
          className={baseStyles}
          onClick={() => {
            navigate(prefixedPath);
            setIsOpen(false);
          }}
        >
          <Icon className="h-4 w-4" />
          {item.label}
        </button>
      );
    }

    return (
      <Link
        key={item.path}
        to={prefixedPath}
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
      <header className="border-r border-gray-200 bg-[#fafafa] fixed left-0 top-0 h-screen hidden md:block w-64">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <img 
              src="https://assets.cdn.filesafe.space/Q5OD6tvJPFLSMWrJ9Ent/media/673c037af980e11b5682313e.png"
              alt="Logo"
              className="h-12 w-auto"
            />
            <div className="mt-4">
              <LanguageSwitcher />
            </div>
          </div>
          
          <nav className="flex-1 px-3">
            {menuItems.map(item => renderMenuItem(item))}
          </nav>

          <ProjectPointsInfo />

          <div className="p-4 border-t border-gray-200">
            <UserMenu isMobile={false} />
          </div>
        </div>
      </header>

      {/* Mobile Menu - Horizontal */}
      <header className="md:hidden fixed top-0 left-0 right-0 border-b border-gray-200 bg-[#fafafa] z-40">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <img 
                src="https://assets.cdn.filesafe.space/Q5OD6tvJPFLSMWrJ9Ent/media/673c037af980e11b5682313e.png"
                alt="Logo"
                className="h-11 w-auto"
              />
            </div>

            <div className="flex items-center gap-4">
              <UserMenu isMobile={true} />
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Menu className="h-5 w-5 text-black" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] p-0">
                  <div className="flex flex-col h-full">
                    <nav className="flex-1 overflow-y-auto p-4">
                      {menuItems.map(item => renderMenuItem(item, true))}
                    </nav>
                    <div className="p-4 border-t border-gray-200">
                      <ProjectPointsInfo />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Content Padding */}
      <div className="md:hidden h-16" />
    </>
  );
};