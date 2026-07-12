import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowLeftRight, CheckCircle2 } from "lucide-react";

interface Activity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: string;
  statusColor: string;
  avatarSrc?: string;
  avatarInitials?: string;
  icon?: React.ReactNode;
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
      <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
        {activities.map((activity, index) => (
          <div key={activity.id} className="relative flex items-start gap-4">
            <div className="relative z-10 w-10 h-10 rounded-full border border-background bg-card flex items-center justify-center shrink-0 shadow-sm mt-1">
               {activity.avatarSrc ? (
                 <Avatar className="w-8 h-8">
                   <AvatarImage src={activity.avatarSrc} alt={activity.title} />
                   <AvatarFallback>{activity.avatarInitials}</AvatarFallback>
                 </Avatar>
               ) : (
                 <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                   {activity.icon || <Package className="w-4 h-4" />}
                 </div>
               )}
            </div>
            
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-6">
              <div>
                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{activity.description} · <span className="text-muted-foreground/70">{activity.timestamp}</span></p>
              </div>
              <Badge variant="outline" className={`shrink-0 rounded-md ${activity.statusColor} bg-background font-normal`}>
                {activity.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
