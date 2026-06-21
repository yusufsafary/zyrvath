import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Zap, Heart, Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ships, Ship } from "@/lib/game-data";

type BattleLog = {
  id: number;
  text: string;
  type: "info" | "hit" | "miss" | "critical" | "defend";
};

export default function Demo() {
  const [playerShip, setPlayerShip] = useState<Ship | null>(null);
  const [npcShip, setNpcShip] = useState<Ship | null>(null);
  
  const [playerHp, setPlayerHp] = useState(0);
  const [npcHp, setNpcHp] = useState(0);
  
  const [battleLogs, setBattleLogs] = useState<BattleLog[]>([]);
  const [logCounter, setLogCounter] = useState(0);
  const [isBattling, setIsBattling] = useState(false);
  const [battleOver, setBattleOver] = useState(false);
  const [winner, setWinner] = useState<"player" | "npc" | null>(null);

  const logsEndRef = useRef<HTMLDivElement>(null);

  const starterShips = ships.filter(s => s.tier <= 2);

  const addLog = (text: string, type: BattleLog["type"]) => {
    setBattleLogs(prev => [...prev, { id: logCounter + prev.length, text, type }]);
    setLogCounter(c => c + 1);
  };

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [battleLogs]);

  const startBattle = (selectedShip: Ship) => {
    const randomNpc = ships[Math.floor(Math.random() * ships.length)];
    setPlayerShip(selectedShip);
    setNpcShip(randomNpc);
    setPlayerHp(selectedShip.hp);
    setNpcHp(randomNpc.hp);
    setBattleLogs([{ id: logCounter, text: `Battle initiated: ${selectedShip.name} vs ${randomNpc.name}`, type: "info" }]);
    setLogCounter(c => c + 1);
    setIsBattling(true);
    setBattleOver(false);
    setWinner(null);
  };

  const processAttack = (attacker: Ship, defender: Ship, isPlayerAttacking: boolean) => {
    let currentDefenderHp = isPlayerAttacking ? npcHp : playerHp;
    if (currentDefenderHp <= 0) return currentDefenderHp;

    const evasionCheck = Math.random() < defender.evasion / 100;
    if (evasionCheck) {
      addLog(`${attacker.name} attacked but ${defender.name} EVADED!`, "miss");
      return currentDefenderHp;
    }

    const rawDamage = attacker.attack;
    const mitigatedDamage = defender.shield * 0.3;
    const finalDamage = Math.max(1, Math.floor(rawDamage - mitigatedDamage));

    currentDefenderHp -= finalDamage;
    addLog(`${attacker.name} hit ${defender.name} for ${finalDamage} DMG! (Shields absorbed ${Math.floor(mitigatedDamage)})`, "hit");

    return Math.max(0, currentDefenderHp);
  };

  const nextRound = () => {
    if (!playerShip || !npcShip || battleOver) return;

    let nextNpcHp = npcHp;
    let nextPlayerHp = playerHp;

    // Player attacks
    const playerAttacksTwice = Math.random() < playerShip.fire_rate / 100;
    const playerAttacks = playerAttacksTwice ? 2 : 1;
    
    for (let i = 0; i < playerAttacks; i++) {
      if (nextNpcHp <= 0) break;
      if (i === 1) addLog(`${playerShip.name} fired a SECOND time!`, "info");
      nextNpcHp = processAttack(playerShip, npcShip, true);
    }
    
    setNpcHp(nextNpcHp);

    if (nextNpcHp <= 0) {
      setBattleOver(true);
      setWinner("player");
      addLog(`${npcShip.name} DESTROYED! You win!`, "critical");
      return;
    }

    // NPC attacks
    const npcAttacksTwice = Math.random() < npcShip.fire_rate / 100;
    const npcAttacks = npcAttacksTwice ? 2 : 1;

    for (let i = 0; i < npcAttacks; i++) {
      if (nextPlayerHp <= 0) break;
      if (i === 1) addLog(`${npcShip.name} fired a SECOND time!`, "info");
      nextPlayerHp = processAttack(npcShip, playerShip, false);
    }

    setPlayerHp(nextPlayerHp);

    if (nextPlayerHp <= 0) {
      setBattleOver(true);
      setWinner("npc");
      addLog(`${playerShip.name} DESTROYED! You have been defeated.`, "destructive");
    }
  };

  if (!isBattling || !playerShip || !npcShip) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8 text-center">SELECT YOUR VESSEL</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
          {starterShips.map(ship => (
            <div key={ship.id} className="bg-card border border-border rounded-xl p-6 hover:border-primary transition-all flex flex-col gap-4">
              <div>
                <h3 className="text-xl font-bold">{ship.name}</h3>
                <span className="text-xs font-semibold text-primary">TIER {ship.tier}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1" data-testid={`stat-hp-${ship.id}`}><Heart className="w-4 h-4 text-red-500"/> {ship.hp}</div>
                <div className="flex items-center gap-1" data-testid={`stat-shield-${ship.id}`}><Shield className="w-4 h-4 text-teal-500"/> {ship.shield}</div>
                <div className="flex items-center gap-1" data-testid={`stat-attack-${ship.id}`}><Zap className="w-4 h-4 text-blue-500"/> {ship.attack}</div>
                <div className="flex items-center gap-1" data-testid={`stat-fire-${ship.id}`}><Crosshair className="w-4 h-4 text-purple-500"/> {ship.fire_rate}%</div>
              </div>
              <Button onClick={() => startBattle(ship)} data-testid={`button-select-ship-${ship.id}`} className="w-full mt-2">SELECT</Button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      <div className="flex flex-col md:flex-row gap-8 justify-between items-center bg-card border border-border p-6 rounded-2xl">
        {/* Player Stats */}
        <div className="w-full md:w-1/3 flex flex-col gap-2">
          <h3 className="text-xl font-bold text-primary">{playerShip.name}</h3>
          <div className="h-4 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-teal-500"
              initial={{ width: "100%" }}
              animate={{ width: `${(playerHp / playerShip.hp) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-sm font-medium">
            <span>HP</span>
            <span>{playerHp} / {playerShip.hp}</span>
          </div>
        </div>

        <div className="text-2xl font-black text-muted-foreground">VS</div>

        {/* NPC Stats */}
        <div className="w-full md:w-1/3 flex flex-col gap-2 text-right">
          <h3 className="text-xl font-bold text-destructive">{npcShip.name}</h3>
          <div className="h-4 bg-muted rounded-full overflow-hidden flex justify-end">
            <motion.div 
              className="h-full bg-red-500"
              initial={{ width: "100%" }}
              animate={{ width: `${(npcHp / npcShip.hp) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-sm font-medium">
            <span>{npcHp} / {npcShip.hp}</span>
            <span>HP</span>
          </div>
        </div>
      </div>

      {/* Battle Log */}
      <div className="bg-card border border-border rounded-2xl p-4 h-64 overflow-y-auto font-mono text-sm flex flex-col gap-2">
        <AnimatePresence>
          {battleLogs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-2 rounded border-l-2 ${
                log.type === "info" ? "border-blue-500 text-blue-200" :
                log.type === "hit" ? "border-orange-500 text-orange-200 bg-orange-500/10" :
                log.type === "miss" ? "border-gray-500 text-gray-400" :
                "border-red-600 text-red-400 font-bold bg-red-900/20"
              }`}
            >
              {log.text}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={logsEndRef} />
      </div>

      {/* Controls */}
      <div className="flex justify-center">
        {!battleOver ? (
          <Button size="lg" onClick={nextRound} data-testid="button-next-round" className="w-full md:w-auto px-12 h-14 text-lg bg-primary hover:bg-primary/80">
            NEXT ROUND
          </Button>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <h2 className={`text-3xl font-bold ${winner === "player" ? "text-teal-500" : "text-destructive"}`}>
              {winner === "player" ? "VICTORY" : "DEFEAT"}
            </h2>
            <Button size="lg" onClick={() => setIsBattling(false)} data-testid="button-play-again" variant="outline">
              PLAY AGAIN
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
