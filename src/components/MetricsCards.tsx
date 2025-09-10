import { TrendingUp, TrendingDown, Users, AlertTriangle, Route, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';

const MetricsCards = () => {
  const metrics = [
    {
      title: 'Total Crowd Count',
      value: '1,24,567',
      change: '+5.2%',
      trend: 'up',
      icon: Users,
      color: 'primary',
      description: 'Real-time headcount'
    },
    {
      title: 'Danger Zones',
      value: '7',
      change: '+2',
      trend: 'up',
      icon: AlertTriangle,
      color: 'danger',
      description: 'High-risk areas identified'
    },
    {
      title: 'Safe Routes',
      value: '23',
      change: '+4',
      trend: 'up',
      icon: Route,
      color: 'success',
      description: 'Alternative paths available'
    },
    {
      title: 'System Health',
      value: '98.7%',
      change: '+0.3%',
      trend: 'up',
      icon: Activity,
      color: 'primary',
      description: 'AI model accuracy'
    },
  ];

  const getColorClasses = (color: string, trend: string) => {
    const baseClasses = {
      primary: 'bg-gradient-primary text-primary-foreground glow-primary',
      danger: 'bg-gradient-danger text-destructive-foreground glow-danger pulse-danger',
      success: 'bg-gradient-success text-success-foreground glow-success',
      warning: 'bg-gradient-warning text-warning-foreground glow-warning'
    };
    return baseClasses[color as keyof typeof baseClasses] || baseClasses.primary;
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? TrendingUp : TrendingDown;
  };

  const getTrendColor = (trend: string, color: string) => {
    if (color === 'danger') return 'text-destructive-foreground';
    return trend === 'up' ? 'text-success' : 'text-destructive';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const TrendIcon = getTrendIcon(metric.trend);
        
        return (
          <Card key={index} className="glass-card border border-border/50 p-6 hover:border-primary/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(metric.color, metric.trend)}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center space-x-1 text-sm font-medium ${getTrendColor(metric.trend, metric.color)}`}>
                <TrendIcon className="w-4 h-4" />
                <span>{metric.change}</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-1">{metric.value}</h3>
              <p className="text-sm font-medium text-card-foreground mb-1">{metric.title}</p>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default MetricsCards;