import { Trophy, Crosshair, Activity, ShieldAlert } from "lucide-react";
import { leaderboardData } from "@/lib/game-data";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Leaderboard() {
  return (
    <div className="flex flex-col gap-10 py-8 px-4 relative z-20">
      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-black font-display mb-4 text-white flex items-center justify-center gap-4 uppercase tracking-widest drop-shadow-[0_0_15px_rgba(0,255,255,0.4)]">
          <Trophy className="w-10 h-10 text-primary drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]" />
          TOP COMMANDERS
        </h1>
        <div className="h-1 w-24 bg-primary mx-auto shadow-[0_0_10px_rgba(0,255,255,0.8)] mb-6"></div>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">The most lethal tacticians in the Orion Arm. Ranked by ELO rating.</p>
      </div>

      <div className="bg-black/60 backdrop-blur-md border border-border border-l-4 border-l-primary rounded-none overflow-hidden shadow-[0_0_30px_rgba(0,255,255,0.05)] relative">
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.1) 2px, rgba(0,255,255,0.1) 4px)' }}></div>
        
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead className="bg-background/80 border-b border-border">
              <tr>
                <th className="px-6 py-5 font-display text-sm font-bold tracking-widest uppercase text-muted-foreground">Rank</th>
                <th className="px-6 py-5 font-display text-sm font-bold tracking-widest uppercase text-muted-foreground">Commander</th>
                <th className="px-6 py-5 font-display text-sm font-bold tracking-widest uppercase text-muted-foreground">Rating (ELO)</th>
                <th className="px-6 py-5 font-display text-sm font-bold tracking-widest uppercase text-muted-foreground">Win Rate</th>
                <th className="px-6 py-5 font-display text-sm font-bold tracking-widest uppercase text-muted-foreground">Record (W-L)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {leaderboardData.map((entry, i) => (
                <tr key={entry.name} className="hover:bg-primary/5 transition-colors">
                  <td className="px-6 py-5 font-display font-black text-2xl">
                    {entry.rank <= 3 ? (
                      <span className={`inline-flex items-center justify-center w-10 h-10 border ${
                        entry.rank === 1 ? "bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.5)]" :
                        entry.rank === 2 ? "bg-slate-300/20 text-slate-300 border-slate-300/50 shadow-[0_0_10px_rgba(203,213,225,0.5)]" :
                        "bg-orange-700/20 text-orange-500 border-orange-700/50 shadow-[0_0_10px_rgba(194,65,12,0.5)]"
                      } [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]`}>
                        {entry.rank}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/50 pl-3">{entry.rank.toString().padStart(2, '0')}</span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="font-bold text-white text-lg tracking-wide mb-1">{entry.name}</div>
                    <div className="text-xs text-primary font-bold font-display tracking-widest uppercase flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      {entry.militaryRank}
                    </div>
                  </td>
                  <td className="px-6 py-5 font-mono text-primary font-bold text-lg drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]">
                    {entry.elo}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center gap-3">
                        <div className="w-24 h-1.5 bg-background overflow-hidden border border-border/50">
                          <div 
                            className="h-full bg-primary shadow-[0_0_5px_rgba(0,255,255,0.8)]" 
                            style={{ width: `${entry.winRate}%` }} 
                          />
                        </div>
                        <span className="font-mono font-bold text-white">{entry.winRate.toFixed(1)}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-mono text-muted-foreground font-medium">
                    <span className="text-primary drop-shadow-[0_0_2px_rgba(0,255,255,0.8)]">{entry.wins}</span> 
                    <span className="opacity-50 mx-1">/</span> 
                    <span className="text-red-500">{entry.losses}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center bg-black/40 backdrop-blur-md border border-primary/30 p-10 mt-8 relative overflow-hidden [clip-path:polygon(0_0,calc(100%-24px)_0,100%_24px,100%_100%,24px_100%,0_calc(100%-24px))]">
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10"></div>
        
        <h2 className="text-3xl md:text-4xl font-black font-display mb-4 text-white uppercase tracking-widest">READY TO PROVE YOURSELF?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">Enter the simulator and test your strategic mettle against AI combatants. Only the strongest survive the void.</p>
        <Button asChild size="lg" data-testid="button-join-battle" className="h-14 px-12 text-lg font-black font-display uppercase tracking-widest bg-primary hover:bg-white text-primary-foreground hover:text-black transition-all shadow-[0_0_20px_rgba(0,255,255,0.4)] [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))] border-none">
          <Link href="/demo">JOIN THE BATTLE</Link>
        </Button>
      </div>
    </div>
  );
}
