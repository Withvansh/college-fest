
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, TrendingUp, Users, FileText, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  description: string;
  count?: number;
  action?: string;
  icon: React.ReactNode;
}

const AlertsPanel = () => {
  const { toast } = useToast();
  
  const alerts: Alert[] = [
    {
      id: '1',
      type: 'warning',
      title: 'Unreviewed Applicants',
      description: 'applicants waiting for review',
      count: 3,
      action: 'Review Now',
      icon: <Users className="h-4 w-4" />
    },
    {
      id: '2',
      type: 'info',
      title: 'Aging Jobs',
      description: 'job open for 30+ days',
      count: 1,
      action: 'View Job',
      icon: <Clock className="h-4 w-4" />
    },
    {
      id: '3',
      type: 'success',
      title: 'Conversion Rate',
      description: 'This month: 12%',
      action: 'View Analytics',
      icon: <TrendingUp className="h-4 w-4" />
    },
    {
      id: '4',
      type: 'warning',
      title: 'Pending Tests',
      description: 'tests need grading',
      count: 5,
      action: 'Grade Tests',
      icon: <FileText className="h-4 w-4" />
    },
    {
      id: '5',
      type: 'info',
      title: 'Interviews Today',
      description: 'scheduled interviews',
      count: 2,
      action: 'View Schedule',
      icon: <Calendar className="h-4 w-4" />
    }
  ];

  const handleAlertAction = (alert: Alert) => {
    toast({
      title: alert.action,
      description: `Handling: ${alert.title}`,
    });
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'info': return 'border-blue-200 bg-blue-50';
      case 'success': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'success': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Alerts & Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className={`border rounded-lg p-3 ${getAlertColor(alert.type)}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5">
                    {alert.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{alert.title}</h4>
                      {alert.count && (
                        <Badge className={getBadgeColor(alert.type)}>
                          {alert.count}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600">
                      {alert.count ? `${alert.count} ` : ''}{alert.description}
                    </p>
                  </div>
                </div>
                {alert.action && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAlertAction(alert)}
                    className="text-xs"
                  >
                    {alert.action}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsPanel;
