import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Zap, Heart, Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ships, Ship } from "@/lib/game-data";

type BattleLog = {
  id: number;
  text: string;
  type: "info" | "hit" | "miss" | "critical" | "destructive";
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
    setBattleLogs([{ id: logCounter, text: `BATTLE INITIATED: ${selectedShip.name} vs ${randomNpc.name}`, type: "info" }]);
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
      addLog(`[MISS] ${attacker.name} attacked but ${defender.name} EVADED!`, "miss");
      return currentDefenderHp;
    }

    const rawDamage = attacker.attack;
    const mitigatedDamage = defender.shield * 0.3;
    const finalDamage = Math.max(1, Math.floor(rawDamage - mitigatedDamage));

    currentDefenderHp -= finalDamage;
    addLog(`[HIT] ${attacker.name} hit ${defender.name} for ${finalDamage} DMG (Shields absorbed ${Math.floor(mitigatedDamage)})`, "hit");

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
      if (i === 1) addLog(`[CRITICAL] ${playerShip.name} high fire rate triggered double attack!`, "critical");
      nextNpcHp = processAttack(playerShip, npcShip, true);
    }
    
    setNpcHp(nextNpcHp);

    if (nextNpcHp <= 0) {
      setBattleOver(true);
      setWinner("player");
      addLog(`[VICTORY] ${npcShip.name} DESTROYED!`, "info");
      return;
    }

    // NPC attacks
    const npcAttacksTwice = Math.random() < npcShip.fire_rate / 100;
    const npcAttacks = npcAttacksTwice ? 2 : 1;

    for (let i = 0; i < npcAttacks; i++) {
      if (nextPlayerHp <= 0) break;
      if (i === 1) addLog(`[WARNING] ${npcShip.name} high fire rate triggered double attack!`, "critical");
      nextPlayerHp = processAttack(npcShip, playerShip, false);
    }

    setPlayerHp(nextPlayerHp);

    if (nextPlayerHp <= 0) {
      setBattleOver(true);
      setWinner("npc");
      addLog(`[DEFEAT] ${playerShip.name} DESTROYED! You have been defeated.`, "destructive");
    }
  };

  if (!isBattling || !playerShip || !npcShip) {
    return (
      <div className="max-w-5xl mx-auto flex flex-col items-center relative z-20 py-8">
        <h1 className="text-4xl md:text-5xl font-black font-display mb-12 text-center text-white uppercase tracking-widest drop-shadow-[0_0_15px_rgba(0,255,255,0.4)]">Select Your Vessel</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full px-4">
          {starterShips.map(ship => (
            <div key={ship.id} className="bg-black/60 backdrop-blur-md border border-border border-l-4 rounded-r-xl p-6 hover:border-primary/50 transition-all flex flex-col gap-5 relative overflow-hidden group" style={{ borderLeftColor: ship.tier === 1 ? '#10b981' : '#3b82f6' }}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-black font-display uppercase tracking-wider text-white mb-1">{ship.name}</h3>
                <span className="text-xs font-bold tracking-widest font-display text-muted-foreground uppercase">TIER {ship.tier} INTERCEPTOR</span>
              </div>
              
              <div className="space-y-3 relative z-10 flex-grow">
                <div>
                  <div className="flex justify-between text-xs font-bold font-display uppercase tracking-wider text-muted-foreground mb-1">
                    <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-red-500"/> Hull</span>
                    <span data-testid={`stat-hp-${ship.id}`}>{ship.hp}</span>
                  </div>
                  <div className="h-1 w-full bg-background"><div className="h-full bg-red-500" style={{width: `${(ship.hp/150)*100}%`}}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold font-display uppercase tracking-wider text-muted-foreground mb-1">
                    <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-teal-400"/> Shield</span>
                    <span data-testid={`stat-shield-${ship.id}`}>{ship.shield}</span>
                  </div>
                  <div className="h-1 w-full bg-background"><div className="h-full bg-teal-400" style={{width: `${(ship.shield/30)*100}%`}}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold font-display uppercase tracking-wider text-muted-foreground mb-1">
                    <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-primary"/> Attack</span>
                    <span data-testid={`stat-attack-${ship.id}`}>{ship.attack}</span>
                  </div>
                  <div className="h-1 w-full bg-background"><div className="h-full bg-primary" style={{width: `${(ship.attack/50)*100}%`}}></div></div>
                </div>
              </div>
              
              <Button onClick={() => startBattle(ship)} data-testid={`button-select-ship-${ship.id}`} className="w-full mt-2 font-display font-bold tracking-widest uppercase rounded-none [clip-path:polygon(0_0,calc(100%-8px)_0,100%_8px,100%_100%,8px_100%,0_calc(100%-8px))] bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/50 relative z-10">
                Initialize Sequence
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const playerHpPercent = (playerHp / playerShip.hp) * 100;
  const npcHpPercent = (npcHp / npcShip.hp) * 100;

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8 relative z-20 py-6 px-4">
      {/* HUD Header */}
      <div className="text-center mb-2">
        <h2 className="font-display text-sm tracking-[0.4em] text-primary/70 uppercase">Combat Simulator Active</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-black/40 backdrop-blur-md border border-primary/30 p-8 relative overflow-hidden [clip-path:polygon(0_0,calc(100%-20px)_0,100%_20px,100%_100%,20px_100%,0_calc(100%-20px))]">
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/60"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/60"></div>
        
        {/* Player Stats */}
        <div className="w-full md:w-5/12 flex flex-col gap-3 relative z-10">
          <div className="flex justify-between items-end">
            <h3 className="text-2xl font-black font-display text-primary uppercase tracking-widest drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]">{playerShip.name}</h3>
            <span className="text-xs font-bold font-mono text-muted-foreground">CMD: YOU</span>
          </div>
          <div className="h-4 bg-background/80 overflow-hidden border border-primary/20 relative shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
            <motion.div 
              className={`h-full ${playerHpPercent > 50 ? 'bg-primary shadow-[0_0_10px_rgba(0,255,255,0.8)]' : playerHpPercent > 25 ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]'}`}
              initial={{ width: "100%" }}
              animate={{ width: `${playerHpPercent}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between font-mono text-sm tracking-wider">
            <span className="text-muted-foreground">INTEGRITY</span>
            <span className={`${playerHpPercent < 25 ? 'text-red-500 animate-pulse' : 'text-primary'}`}>{playerHp} / {playerShip.hp}</span>
          </div>
        </div>

        {/* VS Indicator */}
        <div className="flex flex-col items-center justify-center relative z-10 shrink-0">
          <div className="text-4xl font-black font-display text-white/10 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] mb-1">VS</div>
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
        </div>

        {/* NPC Stats */}
        <div className="w-full md:w-5/12 flex flex-col gap-3 text-right relative z-10">
          <div className="flex justify-between items-end flex-row-reverse">
            <h3 className="text-2xl font-black font-display text-red-500 uppercase tracking-widest drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]">{npcShip.name}</h3>
            <span className="text-xs font-bold font-mono text-muted-foreground">HOSTILE</span>
          </div>
          <div className="h-4 bg-background/80 overflow-hidden flex justify-end border border-red-500/20 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
            <motion.div 
              className={`h-full ${npcHpPercent > 50 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : npcHpPercent > 25 ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]' : 'bg-red-700 shadow-[0_0_10px_rgba(185,28,28,0.8)]'}`}
              initial={{ width: "100%" }}
              animate={{ width: `${npcHpPercent}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between font-mono text-sm tracking-wider flex-row-reverse">
            <span className="text-muted-foreground">INTEGRITY</span>
            <span className="text-red-500">{npcHp} / {npcShip.hp}</span>
          </div>
        </div>
      </div>

      {/* Battle Log */}
      <div className="bg-black/80 border border-border p-5 h-72 overflow-y-auto font-mono text-sm flex flex-col gap-3 relative [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
        <AnimatePresence>
          {battleLogs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`pl-3 py-1 border-l-2 ${
                log.type === "info" ? "border-primary/50 text-primary/80" :
                log.type === "hit" ? "border-white text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]" :
                log.type === "miss" ? "border-slate-600 text-slate-500" :
                log.type === "critical" ? "border-amber-400 text-amber-300 drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]" :
                "border-red-600 text-red-500 font-bold bg-red-900/10"
              }`}
            >
              <span className="opacity-50 mr-2 text-xs">[{log.id.toString().padStart(3, '0')}]</span>
              {log.text}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={logsEndRef} />
      </div>

      {/* Controls */}
      <div className="flex justify-center mt-4">
        {!battleOver ? (
          <Button size="lg" onClick={nextRound} data-testid="button-next-round" className="w-full md:w-auto px-16 h-16 text-xl font-black font-display tracking-[0.2em] uppercase bg-primary hover:bg-white hover:text-black text-primary-foreground shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-all [clip-path:polygon(0_0,calc(100%-16px)_0,100%_16px,100%_100%,16px_100%,0_calc(100%-16px))] border-none">
            Engage
          </Button>
        ) : null}
      </div>

      {/* Battle Over Overlay */}
      <AnimatePresence>
        {battleOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm ${winner === 'player' ? 'bg-primary/10' : 'bg-red-900/20'}`}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className={`max-w-lg w-full p-10 flex flex-col items-center text-center relative overflow-hidden bg-background border-2 ${winner === 'player' ? 'border-primary shadow-[0_0_50px_rgba(0,255,255,0.3)]' : 'border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.3)]'} [clip-path:polygon(0_0,calc(100%-30px)_0,100%_30px,100%_100%,30px_100%,0_calc(100%-30px))]`}
            >
              <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -z-10 ${winner === 'player' ? 'bg-primary/20' : 'bg-red-600/20'}`}></div>
              
              <h2 className={`text-5xl md:text-6xl font-black font-display uppercase tracking-widest mb-2 ${winner === "player" ? "text-white drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]" : "text-white drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]"}`}>
                {winner === "player" ? "VICTORY" : "DEFEAT"}
              </h2>
              
              <p className="font-mono text-muted-foreground mb-10">
                {winner === "player" ? `Hostile ${npcShip.name} eliminated.` : `Your ${playerShip.name} was destroyed.`}
              </p>

              <div className="w-full h-[1px] bg-border mb-8 relative">
                <div className={`absolute left-1/2 -translate-x-1/2 -top-1 px-4 bg-background text-xs font-bold font-display uppercase tracking-widest ${winner === 'player' ? 'text-primary' : 'text-red-500'}`}>Combat Data</div>
              </div>

              <div className="grid grid-cols-2 gap-x-12 gap-y-4 font-mono text-sm w-full mb-10 text-left">
                <div className="flex justify-between border-b border-border/50 pb-1">
                  <span className="text-muted-foreground">Rounds</span>
                  <span className="text-white">{Math.floor(logCounter / 2)}</span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-1">
                  <span className="text-muted-foreground">Hull Int.</span>
                  <span className={winner === 'player' ? 'text-primary' : 'text-red-500'}>{Math.max(0, playerHp)}</span>
                </div>
              </div>

              <Button size="lg" onClick={() => setIsBattling(false)} data-testid="button-play-again" className={`w-full h-14 font-black font-display uppercase tracking-[0.2em] [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))] border-none ${winner === 'player' ? 'bg-primary text-background hover:bg-white' : 'bg-red-600 text-white hover:bg-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)]'}`}>
                RETURN TO FLEET
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
