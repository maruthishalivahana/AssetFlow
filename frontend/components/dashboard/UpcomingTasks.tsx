import React from "react";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: string;
  statusColor: string;
}

interface UpcomingTasksProps {
  tasks: Task[];
}

export function UpcomingTasks({ tasks }: UpcomingTasksProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Upcoming Tasks</h3>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-card transition-colors">
            <div>
              <p className="text-sm font-medium text-foreground">{task.title}</p>
              <p className="text-sm text-muted-foreground mt-0.5">Due date: {task.dueDate}</p>
            </div>
            <Badge variant="secondary" className={`rounded-md px-2.5 py-0.5 text-xs font-normal border ${task.statusColor}`}>
              {task.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
