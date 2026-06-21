import { useState } from "react";
import { Heart, Shield, Zap, Crosshair, Navigation } from "lucide-react";
import { ships } from "@/lib/game-data";

export default function Ships() {
  const [selectedTier, setSelectedTier] = useState<number | "all">("all");

  const filteredShips = selectedTier === "all" ? ships : ships.filter(s => s.tier === selectedTier);

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold mb-4 text-white">IMPERIAL FLEET</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">Catalog of all known operational vessels in the sector.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button 
          onClick={() => setSelectedTier("all")}
          data-testid="filter-tier-all"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedTier === "all" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:border-primary"}`}
        >
          ALL
        </button>
        {[1, 2, 3, 4, 5, 6].map(tier => (
          <button 
            key={tier}
            onClick={() => setSelectedTier(tier)}
            data-testid={`filter-tier-${tier}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedTier === tier ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:border-primary"}`}
          >
            TIER {tier}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredShips.map(ship => (
          <div key={ship.id} className="bg-card border border-border rounded-2xl p-6 hover:shadow-[0_0_15px_rgba(37,99,235,0.15)] hover:border-primary/50 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{ship.name}</h3>
              <span className="px-3 py-1 rounded bg-primary/10 text-primary text-xs font-bold tracking-widest border border-primary/20">
                TIER {ship.tier}
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <StatBar label="HP" icon={Heart} value={ship.hp} max={400} color="bg-red-500" />
              <StatBar label="SHIELD" icon={Shield} value={ship.shield} max={100} color="bg-teal-500" />
              <StatBar label="ATTACK" icon={Zap} value={ship.attack} max={200} color="bg-blue-500" />
              <StatBar label="FIRE RATE" icon={Crosshair} value={ship.fire_rate} max={50} color="bg-purple-500" isPercent />
              <StatBar label="EVASION" icon={Navigation} value={ship.evasion} max={30} color="bg-green-500" isPercent />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatBar({ label, icon: Icon, value, max, color, isPercent = false }: { label: string, icon: any, value: number, max: number, color: string, isPercent?: boolean }) {
  const percentage = Math.min(100, (value / max) * 100);
  
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs font-medium text-muted-foreground">
        <div className="flex items-center gap-1">
          <Icon className="w-3 h-3" />
          {label}
        </div>
        <span>{value}{isPercent ? '%' : ''}</span>
      </div>
      <div className="h-2 w-full bg-background rounded-full overflow-hidden border border-border/50">
        <div 
          className={`h-full ${color}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
