import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Database } from "@/integrations/supabase/types";
import { useState } from "react";
import { UserProfileEditModal } from "./UserProfileEditModal";

type Project = {
  id: string;
  name: string;
  status: string | null;
  pack_type: Database["public"]["Enums"]["project_pack_type"];
};

interface CRMUser {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  user_type: string | null;
  created_at: string;
  projects: Project[] | null;
}

interface CRMTableProps {
  users: CRMUser[];
  onUserUpdated: () => void;
}

const getUserTypeBadge = (type: string | null, hasProjects: boolean) => {
  const effectiveType = hasProjects ? "customer" : type || "lead";

  const styles = {
    lead: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
    member: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    sampler: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
    customer: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  }[effectiveType] || "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";

  const labels = {
    lead: "Lead",
    member: "Member",
    sampler: "Sampler",
    customer: "Customer",
  };

  return (
    <Badge className={`${styles} transition-colors`} variant="outline">
      {labels[effectiveType as keyof typeof labels] || "Unknown"}
    </Badge>
  );
};

export const CRMTable = ({ users, onUserUpdated }: CRMTableProps) => {
  const [selectedUser, setSelectedUser] = useState<CRMUser | null>(null);

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Projects</TableHead>
              <TableHead>Member Since</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {[user.first_name, user.last_name].filter(Boolean).join(" ")}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone || "-"}</TableCell>
                <TableCell>
                  {getUserTypeBadge(user.user_type, Array.isArray(user.projects) && user.projects.length > 0)}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {user.projects?.map((project) => (
                      <div key={project.id} className="text-sm">
                        {project.name}
                      </div>
                    )) || "-"}
                  </div>
                </TableCell>
                <TableCell>
                  {user.created_at
                    ? formatDistanceToNow(new Date(user.created_at), {
                        addSuffix: true,
                      })
                    : "-"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedUser(user)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedUser && (
        <UserProfileEditModal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          user={selectedUser}
          onUserUpdated={onUserUpdated}
        />
      )}
    </>
  );
};