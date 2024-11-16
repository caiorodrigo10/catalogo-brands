import { Check, Clock, AlertCircle, Ban, Calendar } from "lucide-react";
import { useState } from "react";
import { TaskStatusSelect } from "./TaskStatusSelect";
import { TaskAssigneeSelect } from "./TaskAssigneeSelect";
import { TaskDatePicker } from "./TaskDatePicker";

type TaskStatus = "blocked" | "todo" | "in_progress" | "done" | "scheduled" | "not_included";
type AssigneeType = "client" | "account_manager" | "designer" | "none";

interface TaskItemProps {
  name: string;
  status: TaskStatus;
  date?: string;
  startDate?: Date;
  endDate?: Date;
  assignee?: AssigneeType;
  onUpdate: (newName: string) => void;
}

const getStatusIcon = (status: TaskStatus) => {
  switch (status) {
    case "blocked":
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    case "done":
      return <Check className="w-4 h-4 text-green-500" />;
    case "in_progress":
      return <Clock className="w-4 h-4 text-blue-500" />;
    case "scheduled":
      return <Calendar className="w-4 h-4 text-purple-500" />;
    case "not_included":
      return <Ban className="w-4 h-4 text-gray-500" />;
    default:
      return <Clock className="w-4 h-4 text-yellow-500" />;
  }
};

export const TaskItem = ({ 
  name, 
  status, 
  startDate, 
  endDate, 
  assignee = "none",
  onUpdate 
}: TaskItemProps) => {
  const [taskStatus, setTaskStatus] = useState<TaskStatus>(status);
  const [taskAssignee, setTaskAssignee] = useState<AssigneeType>(assignee);
  const [taskStartDate, setTaskStartDate] = useState<Date | undefined>(startDate);
  const [taskEndDate, setTaskEndDate] = useState<Date | undefined>(endDate);

  return (
    <div className="grid grid-cols-[2fr,1fr,1.5fr,1fr,1fr] gap-4 items-center px-4 py-2 hover:bg-accent/50 rounded-md transition-colors">
      {/* Task Name and Status Column */}
      <div className="flex items-center gap-3">
        {getStatusIcon(taskStatus)}
        <span className="text-sm font-medium truncate max-w-[200px]">{name}</span>
      </div>

      {/* Status Select Column */}
      <div className="min-w-[100px]">
        <TaskStatusSelect 
          status={taskStatus} 
          onStatusChange={setTaskStatus} 
        />
      </div>

      {/* Assignee Column */}
      <div>
        <TaskAssigneeSelect 
          assignee={taskAssignee} 
          onAssigneeChange={setTaskAssignee} 
        />
      </div>

      {/* Start Date Column */}
      <div>
        <TaskDatePicker
          label="Start"
          date={taskStartDate}
          onDateChange={setTaskStartDate}
        />
      </div>

      {/* End Date Column */}
      <div>
        <TaskDatePicker
          label="End"
          date={taskEndDate}
          onDateChange={setTaskEndDate}
        />
      </div>
    </div>
  );
};