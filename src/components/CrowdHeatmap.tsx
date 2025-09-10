import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, MapPin, Users } from 'lucide-react';

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

interface CrowdHeatmapProps {
  crowdData?: CrowdData;
}

const CrowdHeatmap = ({ crowdData }: CrowdHeatmapProps) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [liveData, setLiveData] = useState(true);

  // Simulate real-time crowd data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // This would normally fetch real crowd data from your Python backend
      setLiveData(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Use real crowd data if available, otherwise fall back to mock data
  const zones = crowdData ? [
    // Convert real detected persons to zones
    ...crowdData.detectedPersons.map((person, index) => ({
      id: `detected-${person.id}`,
      x: (person.x / 1280) * 100, // Convert to percentage (assuming 1280px width)
      y: (person.y / 720) * 100,  // Convert to percentage (assuming 720px height)
      intensity: Math.round(person.confidence * 100),
      label: `Person ${index + 1}`,
      risk: crowdData.riskLevel,
      people: 1
    })),
    // Add aggregated zone for total count
    {
      id: 'camera-zone',
      x: 50,
      y: 50,
      intensity: crowdData.density,
      label: 'Camera Detection Zone',
      risk: crowdData.riskLevel,
      people: crowdData.totalCount
    }
  ] : [
    // Mock data for demonstration
    { id: 'entry-1', x: 15, y: 20, intensity: 85, label: 'Main Entrance', risk: 'high', people: 2400 },
    { id: 'temple-1', x: 45, y: 35, intensity: 95, label: 'Mahakaleshwar Temple', risk: 'critical', people: 3200 },
    { id: 'parking-1', x: 70, y: 15, intensity: 60, label: 'Parking Area A', risk: 'moderate', people: 1200 },
    { id: 'food-1', x: 25, y: 65, intensity: 75, label: 'Food Court', risk: 'high', people: 1800 },
    { id: 'exit-1', x: 80, y: 80, intensity: 40, label: 'Exit Gate 2', risk: 'safe', people: 800 },
    { id: 'ghats-1', x: 60, y: 70, intensity: 70, label: 'Ram Ghat', risk: 'moderate', people: 1500 },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-destructive shadow-glow-danger';
      case 'high': return 'bg-warning shadow-glow-warning';
      case 'moderate': return 'bg-primary shadow-glow-primary';
      case 'safe': return 'bg-success shadow-glow-success';
      default: return 'bg-muted';
    }
  };

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'critical': return 'CRITICAL';
      case 'high': return 'HIGH RISK';
      case 'moderate': return 'MODERATE';
      case 'safe': return 'SAFE';
      default: return 'UNKNOWN';
    }
  };

  return (
    <Card className="glass-card border border-border/50 p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">Live Crowd Heatmap</h2>
          <p className="text-sm text-muted-foreground">Real-time AI-powered crowd density analysis</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground px-2">{zoomLevel}%</span>
          <Button variant="outline" size="sm" onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Heatmap Container */}
      <div className="relative bg-card border border-border/50 rounded-lg h-96 overflow-hidden">
        {/* Background Map Simulation */}
        <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-card to-muted/30">
          {/* Simulated map grid */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={`v-${i}`} className="absolute bg-border" style={{ left: `${i * 10}%`, width: '1px', height: '100%' }} />
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={`h-${i}`} className="absolute bg-border" style={{ top: `${i * 12.5}%`, width: '100%', height: '1px' }} />
            ))}
          </div>
        </div>

        {/* Crowd Zones */}
        {zones.map((zone) => (
          <div
            key={zone.id}
            className={`absolute cursor-pointer transition-all duration-300 ${getRiskColor(zone.risk)} rounded-full opacity-70 hover:opacity-90 ${
              selectedZone === zone.id ? 'ring-4 ring-primary scale-110' : ''
            }`}
            style={{
              left: `${zone.x}%`,
              top: `${zone.y}%`,
              width: `${Math.max(20, zone.intensity / 5)}px`,
              height: `${Math.max(20, zone.intensity / 5)}px`,
              transform: `translate(-50%, -50%) scale(${zoomLevel / 100})`,
            }}
            onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
          >
            {/* Zone indicator */}
            <div className="absolute inset-0 rounded-full animate-pulse" />
            
            {/* Zone label */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <div className="bg-background/90 backdrop-blur-sm border border-border/50 rounded px-2 py-1 text-xs font-medium text-foreground">
                {zone.label}
              </div>
            </div>
          </div>
        ))}

        {/* Selected Zone Details */}
        {selectedZone && (
          <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg p-4 min-w-64">
            {(() => {
              const zone = zones.find(z => z.id === selectedZone);
              if (!zone) return null;
              
              return (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-foreground">{zone.label}</h3>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      zone.risk === 'critical' ? 'bg-destructive text-destructive-foreground' :
                      zone.risk === 'high' ? 'bg-warning text-warning-foreground' :
                      zone.risk === 'moderate' ? 'bg-primary text-primary-foreground' :
                      'bg-success text-success-foreground'
                    }`}>
                      {getRiskLabel(zone.risk)}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Crowd Density:</span>
                      <span className="font-medium text-foreground">{zone.intensity}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Est. People:</span>
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3 text-primary" />
                        <span className="font-medium text-foreground">{zone.people.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-primary" />
                        <span className="font-medium text-foreground">{zone.x}, {zone.y}</span>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-success shadow-glow-success" />
            <span className="text-xs text-muted-foreground">Safe (0-40%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-primary shadow-glow-primary" />
            <span className="text-xs text-muted-foreground">Moderate (40-70%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-warning shadow-glow-warning" />
            <span className="text-xs text-muted-foreground">High Risk (70-90%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-destructive shadow-glow-danger" />
            <span className="text-xs text-muted-foreground">Critical (90%+)</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <div className={`w-2 h-2 rounded-full ${liveData ? 'pulse-danger bg-success' : 'bg-muted'}`} />
          <span>Live Data Feed</span>
        </div>
      </div>
    </Card>
  );
};

export default CrowdHeatmap;