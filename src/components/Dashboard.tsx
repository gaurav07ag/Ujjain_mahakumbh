import { useState, useEffect } from 'react';
import { Activity, Users, AlertTriangle, Route, Shield, MapPin } from 'lucide-react';
import CrowdHeatmap from './CrowdHeatmap';
import CameraFeed from './CameraFeed';
import MetricsCards from './MetricsCards';
import AlertPanel from './AlertPanel';
import RouteRecommendations from './RouteRecommendations';
import dashboardBg from '@/assets/dashboard-bg.jpg';

interface CrowdData {
  totalCount: number;
  density: number;
  riskLevel: 'safe' | 'moderate' | 'high' | 'critical';
  detectedPersons: Array<{
    id: string;
    x: number;
    y: number;
    confidence: number;
  }>;
}

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLive, setIsLive] = useState(true);
  const [crowdData, setCrowdData] = useState<CrowdData | null>(null);

  const handleCrowdDataUpdate = (data: CrowdData) => {
    setCrowdData(data);
    setIsLive(true);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-5"
        style={{ backgroundImage: `url(${dashboardBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />
      
      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="glass-card border-b border-border/50 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center glow-primary">
                  <Activity className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    Ujjain Mahakumbh Crowd Monitor
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Advanced AI-Powered Crowd Analytics System
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isLive ? 'pulse-danger bg-destructive' : 'bg-muted'}`} />
                  <span className="text-sm font-medium text-foreground">
                    {isLive ? 'LIVE' : 'OFFLINE'}
                  </span>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">
                    {currentTime.toLocaleTimeString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {currentTime.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard Grid */}
        <div className="container mx-auto px-6 py-6 space-y-6">
          {/* Metrics Overview */}
          <MetricsCards />
          
          {/* Camera Feed */}
          <CameraFeed onCrowdDataUpdate={handleCrowdDataUpdate} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Heatmap - Takes up 2/3 on large screens */}
            <div className="xl:col-span-2">
              <CrowdHeatmap crowdData={crowdData} />
            </div>
            
            {/* Side Panel - Alerts and Routes */}
            <div className="space-y-6">
              <AlertPanel />
              <RouteRecommendations />
            </div>
          </div>

          {/* Status Bar */}
          <div className="glass-card p-4 border border-border/50">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-success" />
                  <span className="text-muted-foreground">AI Model: </span>
                  <span className="text-success font-medium">Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Coverage: </span>
                  <span className="text-primary font-medium">98.5%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-warning" />
                  <span className="text-muted-foreground">Active Cameras: </span>
                  <span className="text-warning font-medium">247/250</span>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Last updated: {currentTime.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;