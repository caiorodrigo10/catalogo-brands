import { Link, useLocation } from "react-router-dom";
import { UserRound, Briefcase, BookOpen, Package, FileText } from "lucide-react";
import UserMenu from "./UserMenu";

const Sidebar = () => {
  const location = useLocation();
  const menuItems = [
    { icon: UserRound, label: "Meu Perfil", path: "/perfil" },
    { icon: Briefcase, label: "Projetos", path: "/projetos" },
    { icon: BookOpen, label: "Catalogo", path: "/catalogo" },
    { icon: Package, label: "Meus Produtos", path: "/produtos" },
    { icon: FileText, label: "Documentos", path: "/documentos" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-secondary p-6 text-white flex flex-col shadow-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-primary">Mainer</h1>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all duration-200 hover:bg-primary/10 hover:text-primary ${
                  location.pathname === item.path
                    ? "bg-primary/20 text-primary font-medium"
                    : "text-gray-400"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto pt-6 border-t border-muted">
        <UserMenu />
      </div>
    </aside>
  );
};

export default Sidebar;