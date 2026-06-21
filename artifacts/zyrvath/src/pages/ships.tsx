import { useState } from "react";
import { Heart, Shield, Zap, Crosshair, Navigation } from "lucide-react";
import { ships } from "@/lib/game-data";

export default function Ships() {
  const [selectedTier, setSelectedTier] = useState<number | "all">("all");

  const filteredShips = selectedTier === "all" ? ships : ships.filter(s => s.tier === selectedTier);

  return (
    <div className="flex flex-col gap-10 py-8 relative z-20">
      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-black font-display mb-4 text-white uppercase tracking-widest drop-shadow-[0_0_15px_rgba(0,255,255,0.4)]">IMPERIAL FLEET</h1>
        <div className="h-1 w-24 bg-primary mx-auto shadow-[0_0_10px_rgba(0,255,255,0.8)] mb-6"></div>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">Catalog of all known operational vessels in the sector.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-4 px-4">
        <button 
          onClick={() => setSelectedTier("all")}
          data-testid="filter-tier-all"
          className={`px-6 py-2 rounded-full text-sm font-bold font-display uppercase tracking-widest transition-all ${selectedTier === "all" ? "bg-primary text-background shadow-[0_0_15px_rgba(0,255,255,0.6)] border-transparent" : "bg-black/40 border border-primary/30 text-muted-foreground hover:border-primary hover:text-white"}`}
        >
          ALL
        </button>
        {[1, 2, 3, 4, 5, 6].map(tier => (
          <button 
            key={tier}
            onClick={() => setSelectedTier(tier)}
            data-testid={`filter-tier-${tier}`}
            className={`px-6 py-2 rounded-full text-sm font-bold font-display uppercase tracking-widest transition-all ${selectedTier === tier ? "bg-primary text-background shadow-[0_0_15px_rgba(0,255,255,0.6)] border-transparent" : "bg-black/40 border border-primary/30 text-muted-foreground hover:border-primary hover:text-white"}`}
          >
            TIER {tier}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {filteredShips.map(ship => {
          const tierColors = {
            1: "#10b981", // emerald
            2: "#3b82f6", // blue
            3: "#f59e0b", // amber
            4: "#f97316", // orange
            5: "#e11d48", // rose
            6: "#dc2626"  // red
          };
          const borderColor = tierColors[ship.tier as keyof typeof tierColors] || "#00ffff";

          return (
            <div key={ship.id} className="bg-black/60 backdrop-blur-md border border-border border-l-4 p-6 hover:shadow-[0_0_20px_rgba(0,255,255,0.15)] hover:border-primary/50 transition-all group [clip-path:polygon(0_0,calc(100%-16px)_0,100%_16px,100%_100%,16px_100%,0_calc(100%-16px))] relative overflow-hidden" style={{ borderLeftColor: borderColor }}>
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity" style={{ backgroundColor: borderColor }}></div>
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <h3 className="text-xl font-black font-display text-white uppercase tracking-wider group-hover:text-primary transition-colors">{ship.name}</h3>
                <span className="px-3 py-1 text-xs font-black font-display tracking-widest border bg-background/50" style={{ color: borderColor, borderColor: `${borderColor}40` }}>
                  TIER {ship.tier}
                </span>
              </div>

              <div className="flex flex-col gap-4 relative z-10">
                <StatBar label="HP" icon={Heart} value={ship.hp} max={400} color="bg-red-500" />
                <StatBar label="SHIELD" icon={Shield} value={ship.shield} max={100} color="bg-teal-400" />
                <StatBar label="ATTACK" icon={Zap} value={ship.attack} max={200} color="bg-primary" />
                <StatBar label="FIRE RATE" icon={Crosshair} value={ship.fire_rate} max={50} color="bg-purple-500" isPercent />
                <StatBar label="EVASION" icon={Navigation} value={ship.evasion} max={30} color="bg-green-500" isPercent />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatBar({ label, icon: Icon, value, max, color, isPercent = false }: { label: string, icon: any, value: number, max: number, color: string, isPercent?: boolean }) {
  const percentage = Math.min(100, (value / max) * 100);
  
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-xs font-bold font-display uppercase tracking-widest text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5 text-white/50" />
          {label}
        </div>
        <span className="font-mono text-white">{value}{isPercent ? '%' : ''}</span>
      </div>
      <div className="h-1.5 w-full bg-background/80 overflow-hidden border border-border/50">
        <div 
          className={`h-full ${color}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
