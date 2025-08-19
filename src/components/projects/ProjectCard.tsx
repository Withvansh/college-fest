
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Users, DollarSign, Clock } from "lucide-react";
import { format } from "date-fns";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description?: string;
    status: string;
    priority: string;
    start_date: string;
    end_date?: string;
    budget: number;
    actual_cost: number;
    progress_percentage: number;
    team_lead_profile?: {
      full_name: string;
      email: string;
    };
    tasks?: { count: number }[];
  };
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
}

const statusColors = {
  active: "bg-green-500",
  completed: "bg-blue-500",
  cancelled: "bg-red-500",
  on_hold: "bg-yellow-500"
};

const priorityColors = {
  low: "bg-gray-500",
  medium: "bg-orange-500",
  high: "bg-red-500"
};

export function ProjectCard({ project, onEdit, onView }: ProjectCardProps) {
  const taskCount = project.tasks?.[0]?.count || 0;
  const isOverBudget = project.actual_cost > project.budget;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{project.name}</CardTitle>
            <div className="flex gap-2 mb-3">
              <Badge 
                variant="secondary" 
                className={`${statusColors[project.status as keyof typeof statusColors]} text-white`}
              >
                {project.status.replace('_', ' ').toUpperCase()}
              </Badge>
              <Badge 
                variant="outline"
                className={`${priorityColors[project.priority as keyof typeof priorityColors]} text-white`}
              >
                {project.priority.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
        
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{project.progress_percentage}%</span>
          </div>
          <Progress value={project.progress_percentage} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Start Date</p>
              <p className="text-muted-foreground">
                {format(new Date(project.start_date), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>

          {project.end_date && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">End Date</p>
                <p className="text-muted-foreground">
                  {format(new Date(project.end_date), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Budget</p>
              <p className={`${isOverBudget ? 'text-red-600' : 'text-muted-foreground'}`}>
                ${project.actual_cost.toLocaleString()} / ${project.budget.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Tasks</p>
              <p className="text-muted-foreground">{taskCount} tasks</p>
            </div>
          </div>
        </div>

        {project.team_lead_profile && (
          <div className="pt-3 border-t">
            <p className="text-sm text-muted-foreground">Team Lead</p>
            <p className="font-medium">{project.team_lead_profile.full_name}</p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {onView && (
            <Button variant="outline" size="sm" onClick={() => onView(project.id)}>
              View Details
            </Button>
          )}
          {onEdit && (
            <Button variant="secondary" size="sm" onClick={() => onEdit(project.id)}>
              Edit Project
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
