import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Route, Navigation, Clock, Users, CheckCircle, ArrowRight } from 'lucide-react';

const RouteRecommendations = () => {
  const routes = [
    {
      id: 1,
      name: 'Alternative Path A',
      from: 'Main Gate',
      to: 'Mahakaleshwar Temple',
      status: 'optimal',
      crowdLevel: 'low',
      estimatedTime: '8 min',
      capacity: '85%',
      description: 'Via Ram Ghat walkway - least congested route'
    },
    {
      id: 2,
      name: 'Bypass Route B',
      from: 'Parking Area',
      to: 'Temple Complex',
      status: 'recommended',
      crowdLevel: 'moderate',
      estimatedTime: '12 min',
      capacity: '60%',
      description: 'Through market area - moderate crowd levels'
    },
    {
      id: 3,
      name: 'Emergency Exit C',
      from: 'Temple Area',
      to: 'Safety Zone',
      status: 'emergency',
      crowdLevel: 'low',
      estimatedTime: '5 min',
      capacity: '95%',
      description: 'Direct evacuation route - keep clear for emergencies'
    }
  ];

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'bg-success text-success-foreground border-success glow-success';
      case 'recommended':
        return 'bg-primary text-primary-foreground border-primary glow-primary';
      case 'emergency':
        return 'bg-destructive text-destructive-foreground border-destructive glow-danger';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getCrowdLevelColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-success';
      case 'moderate':
        return 'text-warning';
      case 'high':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'OPTIMAL';
      case 'recommended':
        return 'RECOMMENDED';
      case 'emergency':
        return 'EMERGENCY ONLY';
      default:
        return 'UNKNOWN';
    }
  };

  return (
    <Card className="glass-card border border-border/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Route className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Route Recommendations</h2>
        </div>
        
        <Button variant="outline" size="sm">
          <Navigation className="w-4 h-4 mr-1" />
          Refresh
        </Button>
      </div>

      <div className="space-y-4">
        {routes.map((route) => (
          <div
            key={route.id}
            className="border border-border/50 rounded-lg p-4 hover:border-primary/50 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-foreground">{route.name}</h3>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusStyles(route.status)}`}>
                    {getStatusLabel(route.status)}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{route.description}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 mb-3 text-sm">
              <span className="text-muted-foreground">{route.from}</span>
              <ArrowRight className="w-3 h-3 text-primary" />
              <span className="text-muted-foreground">{route.to}</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
              <div>
                <div className="flex items-center space-x-1 mb-1">
                  <Clock className="w-3 h-3 text-primary" />
                  <span className="text-muted-foreground">ETA</span>
                </div>
                <span className="font-medium text-foreground">{route.estimatedTime}</span>
              </div>
              
              <div>
                <div className="flex items-center space-x-1 mb-1">
                  <Users className="w-3 h-3 text-primary" />
                  <span className="text-muted-foreground">Crowd</span>
                </div>
                <span className={`font-medium capitalize ${getCrowdLevelColor(route.crowdLevel)}`}>
                  {route.crowdLevel}
                </span>
              </div>
              
              <div>
                <div className="flex items-center space-x-1 mb-1">
                  <CheckCircle className="w-3 h-3 text-primary" />
                  <span className="text-muted-foreground">Capacity</span>
                </div>
                <span className="font-medium text-foreground">{route.capacity}</span>
              </div>
            </div>
            
            <Button 
              variant={route.status === 'optimal' ? 'default' : 'outline'} 
              size="sm" 
              className="w-full"
            >
              {route.status === 'emergency' ? 'Emergency Use Only' : 'Use This Route'}
            </Button>
          </div>
        ))}
      </div>

      {/* AI Insights */}
      <div className="pt-4 mt-4 border-t border-border/50">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 bg-gradient-primary rounded flex items-center justify-center glow-primary mt-0.5">
              <Route className="w-3 h-3 text-primary-foreground" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1">AI Recommendation</h4>
              <p className="text-xs text-muted-foreground">
                Current analysis suggests using Alternative Path A for optimal crowd flow. 
                System predicts 23% reduction in congestion if 40% of visitors use this route.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RouteRecommendations;