import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X, Clock, MapPin, Users, Siren } from 'lucide-react';

const AlertPanel = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'critical',
      title: 'Stampede Risk Detected',
      location: 'Mahakaleshwar Temple Entrance',
      crowd: 3200,
      time: '2 min ago',
      description: 'Crowd density exceeds 95% capacity. Immediate evacuation recommended.',
      active: true
    },
    {
      id: 2,
      type: 'high',
      title: 'Bottleneck Formation',
      location: 'Main Gate Bridge',
      crowd: 2400,
      time: '5 min ago',
      description: 'Traffic congestion causing crowd buildup. Deploy crowd control.',
      active: true
    },
    {
      id: 3,
      type: 'moderate',
      title: 'Increased Activity',
      location: 'Food Court Area',
      crowd: 1800,
      time: '12 min ago',
      description: 'Higher than normal crowd density observed.',
      active: true
    },
  ]);

  const dismissAlert = (id: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, active: false } : alert
    ));
  };

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-destructive bg-destructive/10 pulse-danger';
      case 'high':
        return 'border-warning bg-warning/10 pulse-warning';
      case 'moderate':
        return 'border-primary bg-primary/10';
      default:
        return 'border-border bg-card';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <Siren className="w-4 h-4 text-destructive" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-warning" />;
    }
  };

  const getAlertTitle = (type: string) => {
    switch (type) {
      case 'critical':
        return 'CRITICAL ALERT';
      case 'high':
        return 'HIGH PRIORITY';
      case 'moderate':
        return 'MODERATE';
      default:
        return 'ALERT';
    }
  };

  const activeAlerts = alerts.filter(alert => alert.active);

  return (
    <Card className="glass-card border border-border/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <h2 className="text-lg font-bold text-foreground">Active Alerts</h2>
          <div className="bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full font-medium">
            {activeAlerts.length}
          </div>
        </div>
        
        {activeAlerts.length > 0 && (
          <Button variant="outline" size="sm">
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activeAlerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No active alerts</p>
            <p className="text-xs">System monitoring normally</p>
          </div>
        ) : (
          activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border transition-all duration-300 ${getAlertStyles(alert.type)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getAlertIcon(alert.type)}
                  <span className="text-xs font-medium text-muted-foreground">
                    {getAlertTitle(alert.type)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dismissAlert(alert.id)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
              
              <h3 className="font-semibold text-foreground mb-2">{alert.title}</h3>
              <p className="text-sm text-card-foreground mb-3">{alert.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-primary" />
                    <span className="text-muted-foreground">{alert.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-primary" />
                    <span className="text-muted-foreground">{alert.time}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 text-sm">
                  <Users className="w-3 h-3 text-primary" />
                  <span className="text-muted-foreground">Estimated crowd:</span>
                  <span className="font-medium text-foreground">{alert.crowd.toLocaleString()} people</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mt-3">
                <Button variant="outline" size="sm" className="flex-1">
                  View Location
                </Button>
                <Button 
                  variant={alert.type === 'critical' ? 'destructive' : 'default'}
                  size="sm"
                  className="flex-1"
                >
                  {alert.type === 'critical' ? 'Emergency Response' : 'Dispatch Team'}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <div className="pt-4 mt-4 border-t border-border/50">
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="text-xs">
            Emergency Broadcast
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            Deploy Security
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AlertPanel;