import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Zap, Heart, Crosshair, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ships, Ship } from "@/lib/game-data";

type BattleLog = {
  id: number;
  text: string;
  type: "info" | "hit" | "miss" | "critical" | "destructive";
};

type DamageNumber = {
  id: number;
  value: number;
  x: number;
  side: "player" | "npc";
  type: "hit" | "miss" | "critical";
};

function ShipHexagon({ tier, isPlayer, isLow }: { tier: number; isPlayer: boolean; isLow: boolean }) {
  const colors: Record<number, string> = {
    1: "#10b981", 2: "#3b82f6", 3: "#f59e0b",
    4: "#f97316", 5: "#e11d48", 6: "#dc2626"
  };
  const col = isPlayer ? "#ff7800" : (colors[tier] ?? "#e11d48");
  const glowColor = isPlayer
    ? (isLow ? "rgba(239,68,68,0.8)" : "rgba(255,120,0,0.8)")
    : "rgba(239,68,68,0.7)";

  return (
    <svg viewBox="0 0 100 115" className="w-20 h-20" style={{ filter: `drop-shadow(0 0 12px ${glowColor})` }}>
      <polygon
        points="50,5 95,27.5 95,87.5 50,110 5,87.5 5,27.5"
        fill={col} fillOpacity="0.1"
        stroke={col} strokeWidth={isLow ? "2.5" : "1.5"} strokeOpacity="0.8"
      />
      <polygon
        points="50,20 80,36 80,79 50,95 20,79 20,36"
        fill={col} fillOpacity="0.18"
        stroke={col} strokeWidth="1" strokeOpacity="0.5"
      />
      <circle cx="50" cy="57" r="10" fill={col} fillOpacity="0.4" />
      <line x1="50" y1="5" x2="50" y2="20" stroke={col} strokeWidth="1.5" strokeOpacity="0.6" />
      <line x1="95" y1="27.5" x2="80" y2="36" stroke={col} strokeWidth="1.5" strokeOpacity="0.6" />
      <line x1="95" y1="87.5" x2="80" y2="79" stroke={col} strokeWidth="1.5" strokeOpacity="0.6" />
    </svg>
  );
}

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
  const [damageNumbers, setDamageNumbers] = useState<DamageNumber[]>([]);
  const [shakePlayer, setShakePlayer] = useState(false);
  const [shakeNpc, setShakeNpc] = useState(false);
  const [roundCount, setRoundCount] = useState(0);

  const logsEndRef = useRef<HTMLDivElement>(null);
  const dmgIdRef = useRef(0);
  const starterShips = ships.filter(s => s.tier <= 2);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [battleLogs]);

  const addLog = useCallback((text: string, type: BattleLog["type"]) => {
    setBattleLogs(prev => [...prev, { id: dmgIdRef.current++, text, type }]);
  }, []);

  const spawnDamage = (value: number | "MISS", side: "player" | "npc", type: DamageNumber["type"]) => {
    const id = dmgIdRef.current++;
    setDamageNumbers(prev => [...prev, {
      id,
      value: value === "MISS" ? 0 : value,
      x: 30 + Math.random() * 40,
      side,
      type: value === "MISS" ? "miss" : type,
    }]);
    setTimeout(() => {
      setDamageNumbers(prev => prev.filter(d => d.id !== id));
    }, 1200);
  };

  const startBattle = (selectedShip: Ship) => {
    const randomNpc = ships[Math.floor(Math.random() * ships.length)];
    setPlayerShip(selectedShip);
    setNpcShip(randomNpc);
    setPlayerHp(selectedShip.hp);
    setNpcHp(randomNpc.hp);
    setBattleLogs([{ id: dmgIdRef.current++, text: `BATTLE INITIATED: ${selectedShip.name} vs ${randomNpc.name}`, type: "info" }]);
    setIsBattling(true);
    setBattleOver(false);
    setWinner(null);
    setRoundCount(0);
    setDamageNumbers([]);
  };

  const processAttack = (
    attacker: Ship, defender: Ship, isPlayerAttacking: boolean,
    currentNpcHp: number, currentPlayerHp: number
  ): { npcHp: number; playerHp: number } => {
    const defenderHp = isPlayerAttacking ? currentNpcHp : currentPlayerHp;
    if (defenderHp <= 0) return { npcHp: currentNpcHp, playerHp: currentPlayerHp };

    const evaded = Math.random() < defender.evasion / 100;
    if (evaded) {
      addLog(`[MISS] ${attacker.name} attacked but ${defender.name} EVADED!`, "miss");
      spawnDamage("MISS", isPlayerAttacking ? "npc" : "player", "miss");
      return { npcHp: currentNpcHp, playerHp: currentPlayerHp };
    }

    const rawDamage = attacker.attack;
    const mitigated = defender.shield * 0.3;
    const final = Math.max(1, Math.floor(rawDamage - mitigated));

    addLog(`[HIT] ${attacker.name} hit ${defender.name} for ${final} DMG (Shields −${Math.floor(mitigated)})`, "hit");
    spawnDamage(final, isPlayerAttacking ? "npc" : "player", "hit");

    if (isPlayerAttacking) {
      setShakeNpc(true);
      setTimeout(() => setShakeNpc(false), 350);
      return { npcHp: Math.max(0, currentNpcHp - final), playerHp: currentPlayerHp };
    } else {
      setShakePlayer(true);
      setTimeout(() => setShakePlayer(false), 350);
      return { npcHp: currentNpcHp, playerHp: Math.max(0, currentPlayerHp - final) };
    }
  };

  const nextRound = () => {
    if (!playerShip || !npcShip || battleOver) return;
    setRoundCount(c => c + 1);

    let curNpcHp = npcHp;
    let curPlayerHp = playerHp;

    const playerDouble = Math.random() < playerShip.fire_rate / 100;
    const pAttacks = playerDouble ? 2 : 1;
    for (let i = 0; i < pAttacks; i++) {
      if (curNpcHp <= 0) break;
      if (i === 1) addLog(`[CRITICAL] ${playerShip.name} high fire rate — double strike!`, "critical");
      const result = processAttack(playerShip, npcShip, true, curNpcHp, curPlayerHp);
      curNpcHp = result.npcHp;
      curPlayerHp = result.playerHp;
    }
    setNpcHp(curNpcHp);

    if (curNpcHp <= 0) {
      setBattleOver(true);
      setWinner("player");
      addLog(`[VICTORY] ${npcShip.name} DESTROYED!`, "info");
      return;
    }

    const npcDouble = Math.random() < npcShip.fire_rate / 100;
    const nAttacks = npcDouble ? 2 : 1;
    for (let i = 0; i < nAttacks; i++) {
      if (curPlayerHp <= 0) break;
      if (i === 1) addLog(`[WARNING] ${npcShip.name} rapid salvo — double strike!`, "critical");
      const result = processAttack(npcShip, playerShip, false, curNpcHp, curPlayerHp);
      curNpcHp = result.npcHp;
      curPlayerHp = result.playerHp;
    }
    setPlayerHp(curPlayerHp);

    if (curPlayerHp <= 0) {
      setBattleOver(true);
      setWinner("npc");
      addLog(`[DEFEAT] ${playerShip.name} DESTROYED! You have been defeated.`, "destructive");
    }
  };

  if (!isBattling || !playerShip || !npcShip) {
    return (
      <div className="max-w-5xl mx-auto flex flex-col items-center relative z-20 py-8">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-black font-display mb-3 text-white uppercase tracking-widest drop-shadow-[0_0_15px_rgba(255,120,0,0.4)]">
            Select Your Vessel
          </h1>
          <p className="text-muted-foreground font-display tracking-widest text-sm uppercase">
            Tier 1 &amp; 2 ships available for combat simulation
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full px-4">
          {starterShips.map((ship, i) => (
            <motion.div
              key={ship.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-black/60 backdrop-blur-md border border-border border-l-4 p-6 hover:border-primary/50 transition-all flex flex-col gap-5 relative overflow-hidden group [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))]"
              style={{ borderLeftColor: ship.tier === 1 ? '#10b981' : '#3b82f6' }}
            >
              <div className="absolute top-0 right-0 w-28 h-28 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/12 transition-colors" />

              <div className="flex justify-between items-start relative z-10">
                <div>
                  <h3 className="text-2xl font-black font-display uppercase tracking-wider text-white mb-1 group-hover:text-primary transition-colors">{ship.name}</h3>
                  <span className="text-xs font-bold tracking-widest font-display text-muted-foreground uppercase">
                    TIER {ship.tier} — {ship.tier === 1 ? "SCOUT" : "FIGHTER"}
                  </span>
                </div>
                <ShipHexagon tier={ship.tier} isPlayer={true} isLow={false} />
              </div>

              <div className="space-y-3 relative z-10 flex-grow">
                {[
                  { label: "Hull", icon: Heart, val: ship.hp, max: 150, color: "bg-red-500", id: `stat-hp-${ship.id}` },
                  { label: "Shield", icon: Shield, val: ship.shield, max: 30, color: "bg-teal-400", id: `stat-shield-${ship.id}` },
                  { label: "Attack", icon: Zap, val: ship.attack, max: 50, color: "bg-primary", id: `stat-attack-${ship.id}` },
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="flex justify-between text-xs font-bold font-display uppercase tracking-wider text-muted-foreground mb-1">
                      <span className="flex items-center gap-1">
                        <stat.icon className="w-3 h-3" style={{ color: stat.color.replace("bg-", "") }} />
                        {stat.label}
                      </span>
                      <span data-testid={stat.id}>{stat.val}</span>
                    </div>
                    <div className="h-1.5 w-full bg-background border border-border/30">
                      <div className={`h-full ${stat.color}`} style={{ width: `${(stat.val / stat.max) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => startBattle(ship)}
                data-testid={`button-select-ship-${ship.id}`}
                className="w-full mt-1 font-display font-bold tracking-widest uppercase [clip-path:polygon(0_0,calc(100%-8px)_0,100%_8px,100%_100%,8px_100%,0_calc(100%-8px))] bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/50 transition-all hover:shadow-[0_0_20px_rgba(255,120,0,0.4)] relative z-10"
              >
                <Swords className="w-4 h-4 mr-2" />
                Deploy to Battle
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  const playerHpPct = (playerHp / playerShip.hp) * 100;
  const npcHpPct = (npcHp / npcShip.hp) * 100;

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6 relative z-20 py-6 px-4">
      <div className="text-center">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 border border-primary/30 bg-primary/5">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_6px_rgba(255,120,0,0.8)]" />
          <span className="font-display text-xs tracking-[0.4em] text-primary/80 uppercase">Combat Simulator — Round {roundCount}</span>
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_6px_rgba(255,120,0,0.8)]" />
        </div>
      </div>

      {/* Battle Arena */}
      <div className="relative flex flex-col md:flex-row gap-6 justify-between items-center bg-black/50 backdrop-blur-md border border-primary/25 p-8 overflow-hidden [clip-path:polygon(0_0,calc(100%-20px)_0,100%_20px,100%_100%,20px_100%,0_calc(100%-20px))]">
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/60" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/60" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/60" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/60" />

        {/* Damage numbers */}
        <AnimatePresence>
          {damageNumbers.map(dmg => (
            <motion.div
              key={dmg.id}
              className={`absolute pointer-events-none font-black font-display text-2xl z-30 ${
                dmg.type === "miss" ? "text-slate-400" :
                dmg.type === "critical" ? "text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]" :
                dmg.side === "player" ? "text-primary drop-shadow-[0_0_8px_rgba(255,120,0,0.9)]" : "text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.9)]"
              }`}
              style={{ left: `${dmg.x}%`, top: "30%" }}
              initial={{ opacity: 1, y: 0, scale: 1.3 }}
              animate={{ opacity: 0, y: -50, scale: 0.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {dmg.type === "miss" ? "MISS" : `-${dmg.value}`}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Player Side */}
        <motion.div
          className="w-full md:w-5/12 flex flex-col gap-3 relative z-10"
          animate={shakePlayer ? { x: [-6, 6, -4, 4, 0] } : {}}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-xl font-black font-display text-primary uppercase tracking-widest drop-shadow-[0_0_8px_rgba(255,120,0,0.6)]">
              {playerShip.name}
            </h3>
            <ShipHexagon tier={playerShip.tier} isPlayer={true} isLow={playerHpPct < 25} />
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground">CMD: YOU</span>
            <span className="text-xs font-mono" style={{ color: playerHpPct < 25 ? '#ef4444' : playerHpPct < 50 ? '#f59e0b' : '#ff7800' }}>
              {playerHpPct < 25 ? "CRITICAL" : playerHpPct < 50 ? "DAMAGED" : "NOMINAL"}
            </span>
          </div>
          <div className="h-4 bg-background/80 overflow-hidden border border-primary/20 relative shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
            <motion.div
              className={`h-full transition-colors ${playerHpPct > 50 ? "bg-primary shadow-[0_0_10px_rgba(255,120,0,0.8)]" : playerHpPct > 25 ? "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]" : "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"}`}
              initial={{ width: "100%" }}
              animate={{ width: `${playerHpPct}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between font-mono text-sm tracking-wider">
            <span className="text-muted-foreground">HULL INTEGRITY</span>
            <span className={playerHpPct < 25 ? "text-red-500 animate-pulse font-bold" : "text-primary"}>
              {playerHp} / {playerShip.hp}
            </span>
          </div>
        </motion.div>

        {/* VS */}
        <div className="flex flex-col items-center justify-center relative z-10 shrink-0 gap-2">
          <motion.div
            className="text-3xl font-black font-display text-white/20"
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            VS
          </motion.div>
          <div className="w-px h-10 bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
        </div>

        {/* NPC Side */}
        <motion.div
          className="w-full md:w-5/12 flex flex-col gap-3 text-right relative z-10"
          animate={shakeNpc ? { x: [6, -6, 4, -4, 0] } : {}}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center flex-row-reverse mb-1">
            <h3 className="text-xl font-black font-display text-red-500 uppercase tracking-widest drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]">
              {npcShip.name}
            </h3>
            <ShipHexagon tier={npcShip.tier} isPlayer={false} isLow={npcHpPct < 25} />
          </div>
          <div className="flex items-center gap-2 justify-end mb-1">
            <span className="text-xs font-mono" style={{ color: npcHpPct < 25 ? '#ef4444' : npcHpPct < 50 ? '#f59e0b' : '#ef4444' }}>
              {npcHpPct < 25 ? "CRITICAL" : npcHpPct < 50 ? "DAMAGED" : "HOSTILE"}
            </span>
            <span className="text-xs font-mono text-muted-foreground">ENEMY</span>
          </div>
          <div className="h-4 bg-background/80 overflow-hidden flex justify-end border border-red-500/20 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
            <motion.div
              className={`h-full ${npcHpPct > 50 ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" : npcHpPct > 25 ? "bg-orange-500" : "bg-red-700"}`}
              initial={{ width: "100%" }}
              animate={{ width: `${npcHpPct}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between font-mono text-sm tracking-wider flex-row-reverse">
            <span className="text-muted-foreground">HULL INTEGRITY</span>
            <span className="text-red-500">{npcHp} / {npcShip.hp}</span>
          </div>
        </motion.div>
      </div>

      {/* Battle Log */}
      <div className="bg-black/85 border border-border/60 p-5 h-64 overflow-y-auto font-mono text-sm flex flex-col gap-2 relative [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
        <div className="sticky top-0 text-[10px] font-display tracking-[0.3em] text-primary/30 uppercase mb-1 border-b border-border/20 pb-1">
          ▸ Combat Log
        </div>
        <AnimatePresence>
          {battleLogs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className={`pl-3 py-0.5 border-l-2 text-xs ${
                log.type === "info" ? "border-primary/50 text-primary/80" :
                log.type === "hit" ? "border-white/70 text-white/90" :
                log.type === "miss" ? "border-slate-600 text-slate-500" :
                log.type === "critical" ? "border-amber-400 text-amber-300" :
                "border-red-600 text-red-400 font-bold bg-red-900/10"
              }`}
            >
              <span className="opacity-40 mr-2">[{String(log.id).padStart(3, "0")}]</span>
              {log.text}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={logsEndRef} />
      </div>

      {/* Controls */}
      {!battleOver && (
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={nextRound}
            data-testid="button-next-round"
            className="w-full md:w-auto px-16 h-16 text-xl font-black font-display tracking-[0.2em] uppercase bg-primary hover:bg-white hover:text-black text-primary-foreground shadow-[0_0_20px_rgba(255,120,0,0.4)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all [clip-path:polygon(0_0,calc(100%-16px)_0,100%_16px,100%_100%,16px_100%,0_calc(100%-16px))] border-none hover:scale-105"
          >
            <Swords className="w-5 h-5 mr-3" />
            ENGAGE
          </Button>
        </div>
      )}

      {/* Battle Over Overlay */}
      <AnimatePresence>
        {battleOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md ${winner === "player" ? "bg-primary/8" : "bg-red-950/30"}`}
          >
            <motion.div
              initial={{ scale: 0.85, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 14 }}
              className={`max-w-lg w-full p-10 flex flex-col items-center text-center relative overflow-hidden bg-background/95 border-2 ${winner === "player" ? "border-primary shadow-[0_0_60px_rgba(255,120,0,0.35)]" : "border-red-600 shadow-[0_0_60px_rgba(220,38,38,0.35)]"} [clip-path:polygon(0_0,calc(100%-30px)_0,100%_30px,100%_100%,30px_100%,0_calc(100%-30px))]`}
            >
              <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] -z-10 ${winner === "player" ? "bg-primary/15" : "bg-red-600/15"}`} />

              <motion.h2
                className={`text-5xl md:text-6xl font-black font-display uppercase tracking-widest mb-3 ${winner === "player" ? "text-white drop-shadow-[0_0_20px_rgba(255,120,0,0.9)]" : "text-white drop-shadow-[0_0_20px_rgba(220,38,38,0.9)]"}`}
                animate={winner === "player" ? { textShadow: ["0 0 20px rgba(255,120,0,0.6)", "0 0 40px rgba(255,120,0,1)", "0 0 20px rgba(255,120,0,0.6)"] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {winner === "player" ? "VICTORY" : "DEFEAT"}
              </motion.h2>

              <p className="font-mono text-muted-foreground mb-8 text-sm">
                {winner === "player"
                  ? `Hostile ${npcShip.name} has been eliminated from the sector.`
                  : `Your ${playerShip.name} has been destroyed. The void claims another.`}
              </p>

              <div className="w-full h-px bg-border mb-6 relative">
                <div className={`absolute left-1/2 -translate-x-1/2 -top-2.5 px-4 bg-background text-[10px] font-bold font-display uppercase tracking-widest ${winner === "player" ? "text-primary" : "text-red-500"}`}>
                  Combat Report
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-10 gap-y-3 font-mono text-sm w-full mb-8 text-left">
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground">Rounds</span>
                  <span className="text-white font-bold">{roundCount}</span>
                </div>
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground">Hull Left</span>
                  <span className={`font-bold ${winner === "player" ? "text-primary" : "text-red-500"}`}>
                    {Math.max(0, playerHp)}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground">Enemy</span>
                  <span className="text-white">{npcShip.name}</span>
                </div>
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground">Outcome</span>
                  <span className={winner === "player" ? "text-primary" : "text-red-500"}>
                    {winner === "player" ? "DESTROYED" : "LOSS"}
                  </span>
                </div>
              </div>

              <Button
                size="lg"
                onClick={() => setIsBattling(false)}
                data-testid="button-play-again"
                className={`w-full h-14 font-black font-display uppercase tracking-[0.2em] [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))] border-none hover:scale-105 transition-all ${winner === "player" ? "bg-primary text-background hover:bg-white hover:text-black shadow-[0_0_20px_rgba(255,120,0,0.4)]" : "bg-red-600 text-white hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.4)]"}`}
              >
                RETURN TO FLEET
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
