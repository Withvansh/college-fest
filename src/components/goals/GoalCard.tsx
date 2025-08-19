
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, Calendar, TrendingUp } from "lucide-react";
import { format } from "date-fns";

interface GoalCardProps {
  goal: {
    id: string;
    title: string;
    description?: string;
    category: string;
    target_value: number;
    current_value: number;
    unit: string;
    due_date?: string;
    priority: string;
    status: string;
  };
  onEdit?: (id: string) => void;
  onUpdateProgress?: (id: string, value: number) => void;
}

const statusColors = {
  active: "bg-green-500",
  completed: "bg-blue-500",
  paused: "bg-yellow-500"
};

const priorityColors = {
  low: "bg-gray-500",
  medium: "bg-orange-500",
  high: "bg-red-500"
};

export function GoalCard({ goal, onEdit, onUpdateProgress }: GoalCardProps) {
  const progressPercentage = goal.target_value > 0 
    ? Math.min((goal.current_value / goal.target_value) * 100, 100)
    : 0;

  const isOverdue = goal.due_date && new Date(goal.due_date) < new Date();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{goal.title}</CardTitle>
            <div className="flex gap-2 mb-3">
              <Badge 
                variant="secondary" 
                className={`${statusColors[goal.status as keyof typeof statusColors]} text-white`}
              >
                {goal.status.toUpperCase()}
              </Badge>
              <Badge 
                variant="outline"
                className={`${priorityColors[goal.priority as keyof typeof priorityColors]} text-white`}
              >
                {goal.priority.toUpperCase()}
              </Badge>
              <Badge variant="outline">{goal.category}</Badge>
            </div>
          </div>
        </div>
        
        {goal.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {goal.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{goal.current_value} {goal.unit}</span>
            <span>{goal.target_value} {goal.unit}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Target</p>
              <p className="text-muted-foreground">
                {goal.target_value} {goal.unit}
              </p>
            </div>
          </div>

          {goal.due_date && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Due Date</p>
                <p className={`${isOverdue ? 'text-red-600' : 'text-muted-foreground'}`}>
                  {format(new Date(goal.due_date), 'MMM dd, yyyy')}
                  {isOverdue && ' (Overdue)'}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Achievement Rate</p>
              <p className="text-muted-foreground">{Math.round(progressPercentage)}%</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          {onUpdateProgress && goal.status === 'active' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                const newValue = prompt(
                  `Update progress for "${goal.title}"\nCurrent: ${goal.current_value} ${goal.unit}\nTarget: ${goal.target_value} ${goal.unit}\n\nEnter new value:`,
                  goal.current_value.toString()
                );
                if (newValue && !isNaN(Number(newValue))) {
                  onUpdateProgress(goal.id, Number(newValue));
                }
              }}
            >
              Update Progress
            </Button>
          )}
          {onEdit && (
            <Button variant="secondary" size="sm" onClick={() => onEdit(goal.id)}>
              Edit Goal
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
