import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PACK_LABELS } from "@/types/project";

interface ProjectPointsCardProps {
  project: {
    id: string;
    points: number;
    points_used: number;
    pack_type: 'start' | 'pro' | 'ultra';
    user?: {
      first_name?: string;
      last_name?: string;
      email?: string;
      phone?: string;
      shipping_address_street?: string;
      shipping_address_street2?: string;
      shipping_address_city?: string;
      shipping_address_state?: string;
      shipping_address_zip?: string;
    };
  };
}

export const ProjectPointsCard = ({ project }: ProjectPointsCardProps) => {
  return (
    <Card className="p-4">
      <div className="relative">
        {/* Client Information Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Client Information</h3>
            <Badge className="bg-purple-500/10 text-purple-500">
              {PACK_LABELS[project.pack_type]}
            </Badge>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Client Name</p>
              <p className="font-medium">
                {`${project.user?.first_name || ''} ${project.user?.last_name || ''}`.trim() || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{project.user?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{project.user?.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">
                {[
                  project.user?.shipping_address_street,
                  project.user?.shipping_address_city,
                  project.user?.shipping_address_state,
                  project.user?.shipping_address_zip
                ].filter(Boolean).join(', ') || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};