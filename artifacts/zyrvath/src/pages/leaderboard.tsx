import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, ShieldAlert, Search } from "lucide-react";
import { leaderboardData } from "@/lib/game-data";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Leaderboard() {
  const [search, setSearch] = useState("");

  const filtered = leaderboardData.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.militaryRank.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-10 py-8 px-4 relative z-20">
      <div className="text-center mb-4">
        <motion.h1
          className="text-4xl md:text-5xl font-black font-display mb-4 text-white flex items-center justify-center gap-4 uppercase tracking-widest drop-shadow-[0_0_15px_rgba(255,120,0,0.4)]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Trophy className="w-10 h-10 text-primary drop-shadow-[0_0_10px_rgba(255,120,0,0.8)]" />
          TOP COMMANDERS
        </motion.h1>
        <div className="h-1 w-24 bg-primary mx-auto shadow-[0_0_10px_rgba(255,120,0,0.8)] mb-6" />
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          The most lethal tacticians in the Orion Arm. Ranked by ELO rating.
        </p>
      </div>

      <div className="max-w-sm mx-auto w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search commanders..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-border/60 text-white placeholder:text-muted-foreground font-display text-sm tracking-wider focus:outline-none focus:border-primary/60 transition-all"
          />
        </div>
      </div>

      <div className="bg-black/60 backdrop-blur-md border border-border border-l-4 border-l-primary rounded-none overflow-hidden shadow-[0_0_40px_rgba(255,120,0,0.06)] relative">
        <div className="absolute inset-0 pointer-events-none opacity-[0.08]"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,120,0,0.15) 2px, rgba(255,120,0,0.15) 3px)' }}
        />

        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead className="bg-background/80 border-b border-border">
              <tr>
                <th className="px-6 py-5 font-display text-xs font-bold tracking-widest uppercase text-muted-foreground">Rank</th>
                <th className="px-6 py-5 font-display text-xs font-bold tracking-widest uppercase text-muted-foreground">Commander</th>
                <th className="px-6 py-5 font-display text-xs font-bold tracking-widest uppercase text-muted-foreground hidden md:table-cell">Rating (ELO)</th>
                <th className="px-6 py-5 font-display text-xs font-bold tracking-widest uppercase text-muted-foreground">Win Rate</th>
                <th className="px-6 py-5 font-display text-xs font-bold tracking-widest uppercase text-muted-foreground hidden lg:table-cell">Record (W-L)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.map((entry, i) => (
                <motion.tr
                  key={entry.name}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.035, duration: 0.35 }}
                  className={`transition-colors group ${entry.rank === 1 ? "bg-amber-500/5 hover:bg-amber-500/8" : entry.rank === 2 ? "bg-slate-400/5 hover:bg-slate-400/8" : entry.rank === 3 ? "bg-orange-600/5 hover:bg-orange-600/8" : "hover:bg-primary/5"}`}
                >
                  <td className="px-6 py-4 font-display font-black">
                    {entry.rank <= 3 ? (
                      <motion.span
                        className={`inline-flex items-center justify-center w-10 h-10 border font-black text-base ${
                          entry.rank === 1
                            ? "bg-amber-500/25 text-amber-300 border-amber-400/60 shadow-[0_0_14px_rgba(245,158,11,0.6)]"
                            : entry.rank === 2
                            ? "bg-slate-300/20 text-slate-200 border-slate-300/50 shadow-[0_0_10px_rgba(203,213,225,0.5)]"
                            : "bg-orange-700/25 text-orange-400 border-orange-600/50 shadow-[0_0_10px_rgba(194,65,12,0.5)]"
                        } [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]`}
                        animate={entry.rank === 1 ? { boxShadow: ["0 0 10px rgba(245,158,11,0.4)", "0 0 22px rgba(245,158,11,0.8)", "0 0 10px rgba(245,158,11,0.4)"] } : {}}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        {entry.rank}
                      </motion.span>
                    ) : (
                      <span className="text-muted-foreground/40 pl-2 text-lg">{entry.rank.toString().padStart(2, "0")}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-white text-base tracking-wide mb-1 group-hover:text-primary transition-colors">
                      {entry.name}
                    </div>
                    <div className="text-xs text-primary/80 font-bold font-display tracking-widest uppercase flex items-center gap-1.5">
                      <ShieldAlert className="w-3 h-3 shrink-0" />
                      {entry.militaryRank}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-lg text-primary drop-shadow-[0_0_6px_rgba(255,120,0,0.5)] hidden md:table-cell">
                    {entry.elo.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5 min-w-[100px]">
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-1.5 bg-background overflow-hidden border border-border/40 shrink-0">
                          <motion.div
                            className="h-full bg-primary shadow-[0_0_6px_rgba(255,120,0,0.8)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${entry.winRate}%` }}
                            transition={{ delay: i * 0.04 + 0.3, duration: 0.7, ease: "easeOut" }}
                          />
                        </div>
                        <span className="font-mono font-bold text-sm text-white whitespace-nowrap">
                          {entry.winRate.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-muted-foreground hidden lg:table-cell">
                    <span className="text-primary drop-shadow-[0_0_3px_rgba(255,120,0,0.8)]">{entry.wins}</span>
                    <span className="opacity-40 mx-1.5">/</span>
                    <span className="text-red-500">{entry.losses}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground font-display tracking-widest uppercase text-sm">
            No commanders found matching that callsign.
          </div>
        )}
      </div>

      <motion.div
        className="text-center bg-black/40 backdrop-blur-md border border-primary/30 p-10 mt-4 relative overflow-hidden [clip-path:polygon(0_0,calc(100%-24px)_0,100%_24px,100%_100%,24px_100%,0_calc(100%-24px))]"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute top-0 left-0 w-48 h-48 bg-primary/8 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-primary/8 rounded-full blur-3xl -z-10" />

        <h2 className="text-3xl md:text-4xl font-black font-display mb-4 text-white uppercase tracking-widest">
          READY TO PROVE YOURSELF?
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Enter the simulator and test your strategic mettle. Only the strongest survive the void.
        </p>
        <Button
          asChild
          size="lg"
          data-testid="button-join-battle"
          className="h-14 px-12 text-lg font-black font-display uppercase tracking-widest bg-primary hover:bg-white text-primary-foreground hover:text-black transition-all shadow-[0_0_20px_rgba(255,120,0,0.4)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))] border-none"
        >
          <Link href="/demo">JOIN THE BATTLE</Link>
        </Button>
      </motion.div>
    </div>
  );
}
