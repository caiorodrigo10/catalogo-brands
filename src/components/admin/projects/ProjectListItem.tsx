import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, PlusCircle } from "lucide-react";
import ProjectProgress from "@/components/ProjectProgress";
import { cn } from "@/lib/utils";

interface ProjectListItemProps {
  project: {
    id: number;
    name: string;
    client: string;
    email: string;
    phone: string;
    status: string;
    progress: number;
    accountManager: string;
    points: number;
    lastUpdate: string;
    updatedAt: string;
  };
  isExpanded: boolean;
  onToggle: () => void;
}

const ProjectListItem = ({ project, isExpanded, onToggle }: ProjectListItemProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/10 text-emerald-500";
      case "pending":
        return "bg-amber-500/10 text-amber-500";
      case "completed":
        return "bg-blue-500/10 text-blue-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <div className="border border-border/40 rounded-md mb-4">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 flex-1">
            <div>
              <h3 className="font-medium">{project.name}</h3>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{project.client}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{project.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{project.phone}</p>
            </div>
            <div>
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-medium",
                getStatusColor(project.status)
              )}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{project.accountManager}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="ml-2"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>
        </div>
        <div className="mt-4">
          <ProjectProgress progress={project.progress} />
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-border/40 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Project Points</h3>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold">{project.points}</span>
                <Button size="sm" variant="outline" className="h-8">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Points
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Latest Update</h3>
              <p className="text-sm text-muted-foreground">{project.lastUpdate}</p>
              <time className="text-xs text-muted-foreground block mt-1">
                {new Date(project.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </time>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectListItem;