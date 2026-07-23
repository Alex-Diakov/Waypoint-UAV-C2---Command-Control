import React from 'react';
import { Target, Crosshair, Hexagon, ShieldAlert } from 'lucide-react';

const CircularGauge = ({ 
  label, 
  value, 
  colorClass, 
  subValues, 
  icon: Icon 
}: { 
  label: string; 
  value: number; 
  colorClass: string; 
  subValues: {label: string, value: string, textClass: string}[];
  icon: any;
}) => {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col gap-2 p-3 border border-tactical-border/50 bg-tactical-bg">
      <div className="text-[11px] font-bold tracking-widest text-tactical-text uppercase mb-1">{label}</div>
      <div className="flex gap-4 items-center">
        {/* Left Stats */}
        <div className="flex flex-col gap-1.5 flex-1">
          {subValues.map((sv, idx) => (
            <div key={idx} className="flex items-center justify-between text-[10px] uppercase font-mono">
              <span className="text-tactical-text-muted">{sv.label}</span>
              <span className={sv.textClass}>{sv.value}</span>
            </div>
          ))}
        </div>
        
        {/* Gauge */}
        <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            {/* Background Track */}
            <circle
              cx="32"
              cy="32"
              r={radius}
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              className="text-tactical-border"
              strokeLinecap="round"
            />
            {/* Progress Track */}
            <circle
              cx="32"
              cy="32"
              r={radius}
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              className={colorClass}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="relative z-10 text-tactical-border-light">
             <Icon size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

const LinearBar = ({ label, value, trend, trendValue }: { label: string, value: number, trend: 'up' | 'down', trendValue: string }) => {
  return (
    <div className="flex flex-col gap-1 w-full text-[10px] font-mono">
      <div className="flex items-center justify-between">
        <span className="text-tactical-text-muted uppercase">{label}</span>
        <div className="flex items-center gap-2">
          <span className={trend === 'up' ? 'text-tactical-green' : 'text-tactical-red'}>
            {trend === 'up' ? '+' : '-'}{trendValue}
          </span>
          <span className="font-bold text-white w-6 text-right">{value}%</span>
        </div>
      </div>
      <div className="w-full h-1 bg-tactical-border/50 rounded-sm overflow-hidden flex">
        <div className="h-full bg-tactical-primary" style={{ width: `${value}%` }} />
        <div className="w-[2px] h-full bg-white ml-auto mr-4" /> {/* Threshold marker */}
      </div>
    </div>
  );
}

export const FireSupportPanel: React.FC = () => {
  return (
    <div className="flex-1 bg-tactical-surface-dark overflow-y-auto no-scrollbar p-2 flex flex-col gap-2">
      
      {/* Artillery Section */}
      <div className="flex flex-col gap-2">
        <div className="text-[10px] text-tactical-text-muted font-bold tracking-widest border-b border-tactical-border/50 pb-1 mb-1 px-1 flex justify-between items-center">
          <span>Artillery</span>
          <span className="text-tactical-border-light">ℹ</span>
        </div>
        
        {/* Cannons */}
        <div className="flex items-center gap-3 bg-tactical-bg border border-tactical-border/50 p-3">
          <div className="flex flex-col gap-2 w-1/2">
            <div className="text-[12px] font-bold tracking-widest text-white uppercase mb-1">CANNONS</div>
            <div className="flex justify-between text-[10px] font-mono text-tactical-text-muted"><span>Ready</span><span className="text-white">56%</span></div>
            <div className="flex justify-between text-[10px] font-mono text-tactical-text-muted"><span>Ltd</span><span className="text-tactical-orange">31%</span></div>
            <div className="flex justify-between text-[10px] font-mono text-tactical-text-muted"><span>Unavailable</span><span className="text-tactical-red">23%</span></div>
          </div>
          
          <div className="flex items-center justify-center relative w-16 h-16 shrink-0 border border-tactical-border rounded-full p-2">
            <div className="absolute inset-0 border-2 border-tactical-green rounded-full clip-half" style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }}></div>
            <div className="absolute inset-0 border-2 border-tactical-orange rounded-full" style={{ clipPath: 'polygon(0 50%, 50% 50%, 50% 100%, 0 100%)' }}></div>
            <div className="absolute inset-0 border-2 border-tactical-red rounded-full" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 50%, 0 50%)' }}></div>
            <Hexagon size={16} className="text-tactical-text-muted" />
          </div>

          <div className="flex flex-col gap-2 w-1/2">
            <LinearBar label="Precision" value={90} trend="down" trendValue="24%" />
            <LinearBar label="High explosive" value={47} trend="up" trendValue="17%" />
            <LinearBar label="Smoke" value={84} trend="up" trendValue="21%" />
          </div>
        </div>

        {/* Rockets */}
        <div className="flex items-center gap-3 bg-tactical-bg border border-tactical-border/50 p-3">
          <div className="flex flex-col gap-2 w-1/2">
            <div className="text-[12px] font-bold tracking-widest text-white uppercase mb-1">ROCKETS</div>
            <div className="flex justify-between text-[10px] font-mono text-tactical-text-muted"><span>Ready</span><span className="text-white">68%</span></div>
            <div className="flex justify-between text-[10px] font-mono text-tactical-text-muted"><span>Ltd</span><span className="text-tactical-orange">18%</span></div>
            <div className="flex justify-between text-[10px] font-mono text-tactical-text-muted"><span>Unavailable</span><span className="text-tactical-red">14%</span></div>
          </div>
          
          <div className="flex items-center justify-center relative w-16 h-16 shrink-0 border border-tactical-border rounded-full p-2">
            <div className="absolute inset-0 border-2 border-tactical-primary rounded-full clip-half" style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }}></div>
            <div className="absolute inset-0 border-2 border-tactical-orange rounded-full" style={{ clipPath: 'polygon(0 50%, 50% 50%, 50% 100%, 0 100%)' }}></div>
            <div className="absolute inset-0 border-2 border-tactical-red rounded-full" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 50%, 0 50%)' }}></div>
            <Target size={16} className="text-tactical-text-muted" />
          </div>

          <div className="flex flex-col gap-2 w-1/2">
            <LinearBar label="Precision" value={28} trend="down" trendValue="24%" />
            <LinearBar label="High explosive" value={82} trend="up" trendValue="15%" />
            <LinearBar label="Long Range" value={94} trend="up" trendValue="0%" />
          </div>
        </div>
      </div>

      {/* Air Support Section */}
      <div className="flex flex-col gap-2 mt-4">
        <div className="text-[10px] text-tactical-text-muted font-bold tracking-widest border-b border-tactical-border/50 pb-1 mb-1 px-1 flex justify-between items-center">
          <span>Air Support</span>
          <span className="text-tactical-border-light">ℹ</span>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <CircularGauge 
            label="ROTARY" 
            value={75} 
            colorClass="text-tactical-primary" 
            icon={Target}
            subValues={[
              {label: 'Ready', value: '42%', textClass: 'text-white'},
              {label: 'Ltd', value: '31%', textClass: 'text-tactical-orange'},
              {label: 'Unav', value: '27%', textClass: 'text-tactical-red'}
            ]} 
          />
          <CircularGauge 
            label="FIXED" 
            value={53} 
            colorClass="text-tactical-green" 
            icon={Crosshair}
            subValues={[
              {label: 'Ready', value: '53%', textClass: 'text-white'},
              {label: 'Ltd', value: '35%', textClass: 'text-tactical-orange'},
              {label: 'Unav', value: '12%', textClass: 'text-tactical-red'}
            ]} 
          />
          <CircularGauge 
            label="UAS" 
            value={67} 
            colorClass="text-tactical-primary" 
            icon={ShieldAlert}
            subValues={[
              {label: 'Ready', value: '67%', textClass: 'text-white'},
              {label: 'Ltd', value: '18%', textClass: 'text-tactical-orange'},
              {label: 'Unav', value: '15%', textClass: 'text-tactical-red'}
            ]} 
          />
        </div>
      </div>

      {/* Planned Fire Missions */}
      <div className="flex flex-col gap-2 mt-4">
        <div className="text-[10px] text-tactical-text-muted font-bold tracking-widest border-b border-tactical-border/50 pb-1 mb-1 px-1 flex justify-between items-center">
          <span>Planned Fire Missions</span>
          <span className="text-tactical-border-light">ℹ</span>
        </div>
        
        {[
          { time: '0600Z', type: 'Mortar', target: 'Grid 34T BV 1248 5674', asset: 'FO Team Alpha', method: 'Designator', status: 'PENDING', statusClass: 'text-tactical-orange border-tactical-orange' },
          { time: '0600Z', type: 'Mortar', target: 'Supply Depot (S12)', asset: 'FO Team Alpha', method: 'Surveillance Feed', status: 'PENDING', statusClass: 'text-tactical-orange border-tactical-orange' },
          { time: '0600Z', type: 'Mortar', target: 'Supply Depot (S12)', asset: 'Recon Squad 03', method: 'Laser Spotting', status: 'PENDING', statusClass: 'text-tactical-red border-tactical-red' },
        ].map((mission, idx) => (
          <div key={idx} className="flex flex-col gap-2 p-3 bg-tactical-bg border border-tactical-border/50 font-mono text-[11px]">
            <div className="flex items-center gap-2">
              <span className="text-tactical-text border border-tactical-border px-1">{mission.time}</span>
              <span className="text-white font-bold">{mission.type}</span>
              <span className="text-tactical-text-muted">»</span>
              <span className="text-tactical-primary">{mission.target}</span>
              <Crosshair size={12} className="text-tactical-text-muted ml-1" />
            </div>
            
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2 text-tactical-text-muted text-[10px]">
                <ShieldAlert size={12} />
                <span>{mission.asset}</span>
                <span className="mx-1">←--→</span>
                <span>{mission.method}</span>
              </div>
              <div className={`px-2 py-0.5 border text-[9px] uppercase tracking-widest bg-tactical-surface-dark ${mission.statusClass}`}>
                <span className="mr-1">⊘</span> {mission.status}
              </div>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};
