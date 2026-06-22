import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Shield, Zap, Crosshair, Navigation, Search } from "lucide-react";
import { ships } from "@/lib/game-data";

const TIER_COLORS: Record<number, string> = {
  1: "#10b981",
  2: "#3b82f6",
  3: "#f59e0b",
  4: "#f97316",
  5: "#e11d48",
  6: "#dc2626",
};

const TIER_LABELS: Record<number, string> = {
  1: "Scout",
  2: "Fighter",
  3: "Cruiser",
  4: "Destroyer",
  5: "Dreadnought",
  6: "Sovereign",
};

function ShipSilhouette({ tier, color }: { tier: number; color: string }) {
  const shapes: Record<number, React.ReactNode> = {
    1: (
      <polygon points="50,5 65,38 55,38 55,60 45,60 45,38 35,38" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1.2" strokeOpacity="0.6" />
    ),
    2: (
      <polygon points="50,4 68,30 62,30 65,60 50,55 35,60 38,30 32,30" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1.2" strokeOpacity="0.6" />
    ),
    3: (
      <polygon points="50,3 72,25 70,45 60,50 60,62 50,58 40,62 40,50 30,45 28,25" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1.2" strokeOpacity="0.6" />
    ),
    4: (
      <polygon points="50,2 75,22 78,50 65,55 60,65 50,60 40,65 35,55 22,50 25,22" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.4" strokeOpacity="0.7" />
    ),
    5: (
      <polygon points="50,1 78,18 82,45 70,58 68,68 55,65 50,70 45,65 32,68 30,58 18,45 22,18" fill={color} fillOpacity="0.22" stroke={color} strokeWidth="1.5" strokeOpacity="0.75" />
    ),
    6: (
      <>
        <polygon points="50,1 80,16 86,46 72,60 70,72 55,67 50,73 45,67 30,72 28,60 14,46 20,16" fill={color} fillOpacity="0.22" stroke={color} strokeWidth="1.6" strokeOpacity="0.8" />
        <circle cx="50" cy="37" r="8" fill={color} fillOpacity="0.35" stroke={color} strokeWidth="1" strokeOpacity="0.9" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 100 80" className="w-16 h-16" style={{ filter: `drop-shadow(0 0 8px ${color}88)` }}>
      {shapes[tier] ?? shapes[1]}
    </svg>
  );
}

function AnimatedStatBar({ label, icon: Icon, value, max, color, isPercent = false, delay = 0 }: {
  label: string; icon: React.ComponentType<{ className?: string }>; value: number;
  max: number; color: string; isPercent?: boolean; delay?: number;
}) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth(Math.min(100, (value / max) * 100)), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, max, delay]);

  return (
    <div ref={ref} className="flex flex-col gap-1.5">
      <div className="flex justify-between text-xs font-bold font-display uppercase tracking-widest text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5 text-white/50" />
          {label}
        </div>
        <span className="font-mono text-white">{value}{isPercent ? '%' : ''}</span>
      </div>
      <div className="h-1.5 w-full bg-background/80 overflow-hidden border border-border/50">
        <div
          className={`h-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export default function Ships() {
  const [selectedTier, setSelectedTier] = useState<number | "all">("all");
  const [search, setSearch] = useState("");

  const filteredShips = ships.filter(s => {
    const tierMatch = selectedTier === "all" || s.tier === selectedTier;
    const searchMatch = s.name.toLowerCase().includes(search.toLowerCase());
    return tierMatch && searchMatch;
  });

  return (
    <div className="flex flex-col gap-10 py-8 relative z-20">
      <div className="text-center mb-2">
        <motion.h1
          className="text-4xl md:text-5xl font-black font-display mb-4 text-white uppercase tracking-widest drop-shadow-[0_0_15px_rgba(255,120,0,0.4)]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          IMPERIAL FLEET
        </motion.h1>
        <div className="h-1 w-24 bg-primary mx-auto shadow-[0_0_10px_rgba(255,120,0,0.8)] mb-6" />
        <motion.p
          className="text-lg text-muted-foreground max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Catalog of all known operational vessels in the sector.{" "}
          <span className="text-primary font-bold">{ships.length} ships</span> across{" "}
          <span className="text-primary font-bold">6 combat tiers</span>.
        </motion.p>
      </div>

      <div className="flex flex-col items-center gap-4 px-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search vessels..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-border/60 text-white placeholder:text-muted-foreground font-display text-sm tracking-wider focus:outline-none focus:border-primary/60 focus:shadow-[0_0_15px_rgba(255,120,0,0.15)] transition-all"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setSelectedTier("all")}
            data-testid="filter-tier-all"
            className={`px-5 py-2 text-sm font-bold font-display uppercase tracking-widest transition-all border ${selectedTier === "all"
              ? "bg-primary text-background shadow-[0_0_15px_rgba(255,120,0,0.6)] border-transparent"
              : "bg-black/40 border-primary/30 text-muted-foreground hover:border-primary hover:text-white"
            }`}
          >
            ALL ({ships.length})
          </button>
          {[1, 2, 3, 4, 5, 6].map(tier => {
            const count = ships.filter(s => s.tier === tier).length;
            return (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                data-testid={`filter-tier-${tier}`}
                className={`px-5 py-2 text-sm font-bold font-display uppercase tracking-widest transition-all border ${selectedTier === tier
                  ? "text-background border-transparent shadow-[0_0_15px_rgba(255,120,0,0.4)]"
                  : "bg-black/40 border-border/40 text-muted-foreground hover:text-white"
                }`}
                style={selectedTier === tier ? { backgroundColor: TIER_COLORS[tier], borderColor: TIER_COLORS[tier] } : {
                  borderColor: `${TIER_COLORS[tier]}40`,
                }}
              >
                <span style={{ color: selectedTier === tier ? undefined : TIER_COLORS[tier] }}>
                  T{tier}
                </span>{" "}
                <span className={selectedTier === tier ? "text-background/70" : "text-muted-foreground"}>
                  {TIER_LABELS[tier]}
                </span>{" "}
                <span className="opacity-60">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {filteredShips.map((ship, i) => {
            const borderColor = TIER_COLORS[ship.tier] ?? "#00ffff";
            return (
              <motion.div
                key={ship.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                className="bg-black/60 backdrop-blur-md border border-border border-l-4 p-6 hover:shadow-[0_0_24px_rgba(255,120,0,0.15)] hover:border-primary/40 transition-all group [clip-path:polygon(0_0,calc(100%-16px)_0,100%_16px,100%_100%,16px_100%,0_calc(100%-16px))] relative overflow-hidden"
                style={{ borderLeftColor: borderColor }}
              >
                <div
                  className="absolute top-0 right-0 w-40 h-40 opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-500"
                  style={{ backgroundColor: borderColor }}
                />

                <div className="flex justify-between items-start mb-5 relative z-10">
                  <div className="flex flex-col gap-1">
                    <h3
                      className="text-xl font-black font-display text-white uppercase tracking-wider group-hover:text-primary transition-colors"
                    >
                      {ship.name}
                    </h3>
                    <span className="text-xs font-bold tracking-widest font-display uppercase" style={{ color: `${borderColor}cc` }}>
                      {TIER_LABELS[ship.tier]}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <ShipSilhouette tier={ship.tier} color={borderColor} />
                    <span
                      className="px-2.5 py-0.5 text-xs font-black font-display tracking-widest border bg-background/40"
                      style={{ color: borderColor, borderColor: `${borderColor}50` }}
                    >
                      TIER {ship.tier}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3.5 relative z-10">
                  <AnimatedStatBar label="HP" icon={Heart} value={ship.hp} max={400} color="bg-red-500" delay={i * 40} />
                  <AnimatedStatBar label="SHIELD" icon={Shield} value={ship.shield} max={100} color="bg-teal-400" delay={i * 40 + 60} />
                  <AnimatedStatBar label="ATTACK" icon={Zap} value={ship.attack} max={200} color="bg-primary" delay={i * 40 + 120} />
                  <AnimatedStatBar label="FIRE RATE" icon={Crosshair} value={ship.fire_rate} max={50} color="bg-purple-500" isPercent delay={i * 40 + 180} />
                  <AnimatedStatBar label="EVASION" icon={Navigation} value={ship.evasion} max={30} color="bg-green-500" isPercent delay={i * 40 + 240} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>

      {filteredShips.length === 0 && (
        <motion.div
          className="text-center py-20 text-muted-foreground font-display tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-5xl mb-4 opacity-20">◈</div>
          No vessels found in this sector.
        </motion.div>
      )}
    </div>
  );
}
