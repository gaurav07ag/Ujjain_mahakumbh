-- Create enum types for alert severity and status
CREATE TYPE alert_severity AS ENUM ('low', 'moderate', 'high', 'critical');
CREATE TYPE alert_status AS ENUM ('active', 'acknowledged', 'resolved', 'dismissed');
CREATE TYPE emergency_status AS ENUM ('pending', 'dispatched', 'resolved');

-- Create alerts table
CREATE TABLE public.alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    severity alert_severity NOT NULL DEFAULT 'moderate',
    status alert_status NOT NULL DEFAULT 'active',
    location_name TEXT NOT NULL,
    coordinates POINT, -- PostGIS point for precise location
    crowd_count INTEGER,
    density_percentage DECIMAL(5,2),
    camera_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create emergency_contacts table for government officials
CREATE TABLE public.emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    department TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    priority_level INTEGER NOT NULL DEFAULT 1, -- 1 = highest priority
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create emergency_responses table to track response actions
CREATE TABLE public.emergency_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_id UUID REFERENCES public.alerts(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES public.emergency_contacts(id),
    response_type TEXT NOT NULL, -- 'sms', 'email', 'call'
    message TEXT NOT NULL,
    status emergency_status DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create alert_locations table for mapping alert areas on heatmap
CREATE TABLE public.alert_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_id UUID REFERENCES public.alerts(id) ON DELETE CASCADE,
    zone_name TEXT NOT NULL,
    x_coordinate DECIMAL(5,2) NOT NULL, -- Percentage coordinates for heatmap
    y_coordinate DECIMAL(5,2) NOT NULL,
    affected_radius DECIMAL(5,2) DEFAULT 10, -- Radius in percentage
    risk_level alert_severity NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_locations ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your auth requirements)
CREATE POLICY "Allow all operations on alerts" ON public.alerts FOR ALL USING (true);
CREATE POLICY "Allow all operations on emergency_contacts" ON public.emergency_contacts FOR ALL USING (true);
CREATE POLICY "Allow all operations on emergency_responses" ON public.emergency_responses FOR ALL USING (true);
CREATE POLICY "Allow all operations on alert_locations" ON public.alert_locations FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_alerts_status ON public.alerts(status);
CREATE INDEX idx_alerts_severity ON public.alerts(severity);
CREATE INDEX idx_alerts_created_at ON public.alerts(created_at);
CREATE INDEX idx_emergency_responses_alert_id ON public.emergency_responses(alert_id);
CREATE INDEX idx_alert_locations_alert_id ON public.alert_locations(alert_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for alerts table
CREATE TRIGGER update_alerts_updated_at
    BEFORE UPDATE ON public.alerts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample emergency contacts
INSERT INTO public.emergency_contacts (name, position, department, phone, email, priority_level) VALUES
('Dr. Rajesh Kumar', 'District Collector', 'District Administration', '+91-9876543210', 'collector@ujjain.gov.in', 1),
('Inspector Priya Sharma', 'Police Inspector', 'Ujjain Police', '+91-9876543211', 'inspector.sharma@mp.police.gov.in', 1),
('Dr. Amit Patel', 'Chief Medical Officer', 'Health Department', '+91-9876543212', 'cmo@ujjain.health.gov.in', 2),
('Suresh Agarwal', 'Fire Officer', 'Fire Department', '+91-9876543213', 'fire.ujjain@mp.gov.in', 2),
('Kavita Singh', 'Tourism Officer', 'Tourism Department', '+91-9876543214', 'tourism@ujjain.gov.in', 3);

-- Insert sample alerts with locations
INSERT INTO public.alerts (title, description, severity, location_name, crowd_count, density_percentage, camera_id) VALUES
('Stampede Risk Detected', 'Crowd density exceeds 95% capacity. Immediate evacuation recommended.', 'critical', 'Mahakaleshwar Temple Entrance', 3200, 95.0, 'CAM-001'),
('Bottleneck Formation', 'Traffic congestion causing crowd buildup. Deploy crowd control.', 'high', 'Main Gate Bridge', 2400, 78.0, 'CAM-002'),
('Increased Activity', 'Higher than normal crowd density observed.', 'moderate', 'Food Court Area', 1800, 65.0, 'CAM-003');

-- Insert corresponding alert locations for heatmap visualization
INSERT INTO public.alert_locations (alert_id, zone_name, x_coordinate, y_coordinate, affected_radius, risk_level)
SELECT 
    a.id,
    a.location_name,
    CASE 
        WHEN a.location_name = 'Mahakaleshwar Temple Entrance' THEN 45.0
        WHEN a.location_name = 'Main Gate Bridge' THEN 15.0
        WHEN a.location_name = 'Food Court Area' THEN 25.0
    END,
    CASE 
        WHEN a.location_name = 'Mahakaleshwar Temple Entrance' THEN 35.0
        WHEN a.location_name = 'Main Gate Bridge' THEN 20.0
        WHEN a.location_name = 'Food Court Area' THEN 65.0
    END,
    CASE 
        WHEN a.severity = 'critical' THEN 25.0
        WHEN a.severity = 'high' THEN 20.0
        ELSE 15.0
    END,
    a.severity
FROM public.alerts a
WHERE a.status = 'active';