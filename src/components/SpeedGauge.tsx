import { useEffect, useState } from "react";

interface SpeedGaugeProps {
  value: number;
  maxValue: number;
  label: string;
  unit: string;
  isActive: boolean;
}

export const SpeedGauge = ({ value, maxValue, label, unit, isActive }: SpeedGaugeProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    if (isActive) {
      // Animate the value change
      const duration = 300;
      const steps = 20;
      const stepValue = value / steps;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        setDisplayValue(stepValue * currentStep);
        
        if (currentStep >= steps) {
          setDisplayValue(value);
          clearInterval(interval);
        }
      }, stepDuration);
      
      return () => clearInterval(interval);
    } else {
      setDisplayValue(0);
    }
  }, [value, isActive]);
  
  const percentage = Math.min((displayValue / maxValue) * 100, 100);
  const rotation = (percentage / 100) * 180 - 90; // -90 to 90 degrees
  
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-48 h-48">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${(percentage / 100) * 534} 534`}
            className="transition-all duration-300 ease-out"
            style={{
              filter: isActive ? 'drop-shadow(0 0 8px hsl(var(--primary)))' : 'none'
            }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center value display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {displayValue.toFixed(1)}
          </div>
          <div className="text-sm text-muted-foreground mt-1">{unit}</div>
        </div>
        
        {/* Animated pulse effect when active */}
        {isActive && (
          <div className="absolute inset-0 rounded-full animate-pulse" 
               style={{ 
                 background: 'radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)',
               }} 
          />
        )}
      </div>
      
      <div className="text-lg font-medium text-foreground">{label}</div>
    </div>
  );
};