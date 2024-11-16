import { User2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type AssigneeType = "client" | "account_manager" | "designer" | "none" | `admin-${string}`;

interface TaskAssigneeSelectProps {
  assignee: AssigneeType;
  onAssigneeChange: (assignee: AssigneeType) => void;
}

const ASSIGNEE_DATA: Record<string, { name: string; image: string }> = {
  client: {
    name: "Client",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100&h=100&fit=crop",
  },
  account_manager: {
    name: "Account Manager",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=100&h=100&fit=crop",
  },
  designer: {
    name: "Designer",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop",
  },
  none: {
    name: "Assign",
    image: "",
  },
};

export const TaskAssigneeSelect = ({ assignee = "none", onAssigneeChange }: TaskAssigneeSelectProps) => {
  const { data: adminUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, role')
        .eq('role', 'admin');

      if (error) throw error;
      return data;
    }
  });

  const getAssigneeData = (assigneeId: AssigneeType) => {
    if (assigneeId.startsWith('admin-')) {
      const adminId = assigneeId.replace('admin-', '');
      const admin = adminUsers?.find(u => u.id === adminId);
      return admin ? {
        name: `${admin.first_name} ${admin.last_name}`,
        image: admin.avatar_url || '',
      } : ASSIGNEE_DATA.none;
    }
    return ASSIGNEE_DATA[assigneeId] || ASSIGNEE_DATA.none;
  };

  const currentAssignee = getAssigneeData(assignee);

  return (
    <Select value={assignee} onValueChange={(value) => onAssigneeChange(value as AssigneeType)}>
      <SelectTrigger className="h-7">
        <SelectValue>
          <div className="flex items-center gap-1.5">
            <Avatar className="h-5 w-5">
              <AvatarImage src={currentAssignee.image} />
              <AvatarFallback>
                <User2 className="h-3 w-3" />
              </AvatarFallback>
            </Avatar>
            <span>{currentAssignee.name}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="end">
        {Object.entries(ASSIGNEE_DATA).map(([key, data]) => (
          <SelectItem key={key} value={key}>
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={data.image} />
                <AvatarFallback>
                  <User2 className="h-3 w-3" />
                </AvatarFallback>
              </Avatar>
              <span>{data.name}</span>
            </div>
          </SelectItem>
        ))}
        {adminUsers?.map((admin) => (
          <SelectItem key={admin.id} value={`admin-${admin.id}`}>
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={admin.avatar_url || ''} />
                <AvatarFallback>
                  <User2 className="h-3 w-3" />
                </AvatarFallback>
              </Avatar>
              <span>{`${admin.first_name} ${admin.last_name}`}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};