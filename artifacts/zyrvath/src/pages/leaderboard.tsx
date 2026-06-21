import { Trophy, Crosshair, Activity, ShieldAlert } from "lucide-react";
import { leaderboardData } from "@/lib/game-data";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Leaderboard() {
  return (
    <div className="flex flex-col gap-8 pb-16">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold mb-4 text-white flex items-center justify-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-500" />
          TOP COMMANDERS
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">The most lethal tacticians in the Orion Arm. Ranked by ELO rating.</p>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground bg-muted/20 uppercase border-b border-border">
              <tr>
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Commander</th>
                <th className="px-6 py-4">Rating (ELO)</th>
                <th className="px-6 py-4">Win Rate</th>
                <th className="px-6 py-4">Record (W-L)</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((entry, i) => (
                <tr key={entry.name} className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4 font-bold">
                    {entry.rank <= 3 ? (
                      <span className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        entry.rank === 1 ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/50" :
                        entry.rank === 2 ? "bg-gray-300/20 text-gray-300 border border-gray-300/50" :
                        "bg-amber-700/20 text-amber-600 border border-amber-700/50"
                      }`}>
                        {entry.rank}
                      </span>
                    ) : (
                      <span className="text-muted-foreground pl-3">{entry.rank}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-white mb-1">{entry.name}</div>
                    <div className="text-xs text-primary/80 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" />
                      {entry.militaryRank}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-primary font-bold">
                    {entry.elo}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-background rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-teal-500" 
                          style={{ width: `${entry.winRate}%` }} 
                        />
                      </div>
                      <span className="font-mono">{entry.winRate.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-muted-foreground">
                    <span className="text-teal-500">{entry.wins}</span> - <span className="text-red-500">{entry.losses}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center bg-primary/10 border border-primary/20 p-8 rounded-2xl mt-8">
        <h2 className="text-2xl font-bold mb-4 text-white">READY TO PROVE YOURSELF?</h2>
        <p className="text-muted-foreground mb-6">Enter the simulator and test your strategic mettle against AI combatants.</p>
        <Button asChild size="lg" data-testid="button-join-battle" className="font-bold px-8">
          <Link href="/demo">JOIN THE BATTLE</Link>
        </Button>
      </div>
    </div>
  );
}
