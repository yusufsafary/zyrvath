import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import { Rocket, Shield, Zap, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ships } from "@/lib/game-data";
import { leaderboardData } from "@/lib/game-data";

function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  const [i, setI] = useState(0);
  useEffect(() => {
    if (i < text.length) {
      const t = setTimeout(() => { setDisplayed(p => p + text[i]); setI(i + 1); }, 48);
      return () => clearTimeout(t);
    }
  }, [i, text]);
  return <span>{displayed}<span className="animate-pulse opacity-60">|</span></span>;
}

function AnimatedCounter({ target, delay = 0 }: { target: number; delay?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = target / 30;
        const timer = setInterval(() => {
          start = Math.min(start + step, target);
          setVal(Math.round(start));
          if (start >= target) clearInterval(timer);
        }, 35);
        obs.disconnect();
      }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, delay]);
  return <span ref={ref}>{val}</span>;
}

export default function Home() {
  const featuredShips = ships.filter(s => [1, 3, 6].includes(s.tier)).slice(0, 3);
  const topCommanders = leaderboardData.slice(0, 3);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const tierColors = { 1: "#10b981", 3: "#f59e0b", 6: "#dc2626" };

  return (
    <div className="flex flex-col gap-0">
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-[100svh] w-full flex items-center justify-center overflow-hidden border-none bleed-edge -mt-16 md:mt-[-4rem]">

        {/* Animated grid lines */}
        <motion.div style={{ y: parallaxY }} className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,120,0,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,120,0,0.6) 1px, transparent 1px)', backgroundSize: '80px 80px' }}
          />
        </motion.div>

        {/* HUD Lines */}
        {[
          { className: "absolute top-1/4 left-0 h-px bg-primary/25 w-1/3 origin-left", delay: 0.5 },
          { className: "absolute top-1/4 right-0 h-px bg-primary/25 w-1/3 origin-right", delay: 0.5 },
          { className: "absolute bottom-1/4 left-0 h-px bg-primary/15 w-1/4 origin-left", delay: 0.8 },
          { className: "absolute bottom-1/4 right-0 h-px bg-primary/15 w-1/4 origin-right", delay: 0.8 },
        ].map((l, i) => (
          <motion.div key={i} className={l.className}
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ duration: 1.6, ease: "easeOut", delay: l.delay }}
          />
        ))}

        {/* Corner reticles */}
        {[
          "absolute top-8 left-8 w-10 h-10 border-t-2 border-l-2 border-primary/50",
          "absolute top-8 right-8 w-10 h-10 border-t-2 border-r-2 border-primary/50",
          "absolute bottom-8 left-8 w-10 h-10 border-b-2 border-l-2 border-primary/50",
          "absolute bottom-8 right-8 w-10 h-10 border-b-2 border-r-2 border-primary/50",
        ].map((cls, i) => (
          <motion.div key={i} className={cls}
            initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
          />
        ))}

        <div className="relative z-10 flex flex-col items-center text-center max-w-5xl px-6 w-full mt-16">

          {/* Title */}
          <motion.div
            className="flex justify-center flex-wrap mb-5"
            variants={{ hidden: { opacity: 1 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } }}
            initial="hidden" animate="visible"
          >
            {"ZYRVATH".split("").map((char, idx) => (
              <motion.span
                key={idx}
                className="text-5xl md:text-9xl font-black font-display tracking-[0.18em] text-white"
                style={{ textShadow: '0 0 30px rgba(255,120,0,0.7), 0 0 70px rgba(255,120,0,0.35), 0 0 120px rgba(255,120,0,0.15)' }}
                variants={{
                  hidden: { opacity: 0, y: 40, filter: 'blur(10px)', scale: 0.9 },
                  visible: { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1, transition: { type: "spring", damping: 10 } }
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>

          {/* Tagline */}
          <motion.div
            className="text-base md:text-2xl font-display font-bold text-primary mb-3 tracking-widest min-h-[2rem]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
          >
            <TypewriterText text="COMMAND THE VOID. CONQUER THE STARS." />
          </motion.div>

          <motion.p
            className="text-base md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.1, duration: 0.9 }}
          >
            A dying galaxy. Endless battles. One commander.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center gap-5 justify-center w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 3.6, duration: 0.5 }}
          >
            <Button asChild size="lg" data-testid="button-enter-simulator"
              className="w-full sm:w-auto h-14 px-10 text-lg font-black font-display uppercase tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(255,120,0,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_45px_rgba(255,120,0,0.7)] relative overflow-hidden group [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))] border-none"
            >
              <Link href="/demo">
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/40 transition-all z-10 [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))]" />
                <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-[-45deg] animate-[shimmer_2.5s_infinite]" />
                ENTER BATTLE
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline" data-testid="button-view-fleet"
              className="w-full sm:w-auto h-14 px-10 text-lg font-bold font-display uppercase tracking-widest border-2 border-primary text-primary hover:bg-primary/10 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,120,0,0.25)] bg-transparent [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))]"
            >
              <Link href="/ships">VIEW FLEET</Link>
            </Button>
          </motion.div>
        </div>

        <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-primary/40"
          animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border/50 bg-card/70 backdrop-blur-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border/40 text-center">
          {[
            { value: 18, label: "Warships" },
            { value: 6, label: "Tiers" },
            { value: 11, label: "Ranks" },
            { label: "Combat", live: true },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col p-5">
              {stat.live ? (
                <span className="font-display font-black text-2xl text-primary drop-shadow-[0_0_10px_rgba(255,120,0,0.6)] flex items-center justify-center gap-2 h-9">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_6px_rgba(255,120,0,1)]" />
                  LIVE
                </span>
              ) : (
                <span className="font-display font-black text-3xl text-primary drop-shadow-[0_0_10px_rgba(255,120,0,0.5)]">
                  <AnimatedCounter target={stat.value!} delay={i * 100} />
                </span>
              )}
              <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 max-w-7xl mx-auto relative z-20">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-black font-display mb-4 text-white uppercase tracking-wider"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
            Weapons of the Void
          </motion.h2>
          <div className="h-1 w-24 bg-primary mx-auto shadow-[0_0_10px_rgba(255,120,0,0.8)] mb-6" />
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Master the triad of space combat. Positioning, timing, and raw firepower.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: "Attack Power", desc: "Equip plasma rays and singularity cannons to pierce enemy hulls at any range.", color: "rgba(255,120,0,0.5)" },
            { icon: Shield, title: "Shield Defense", desc: "Manage deflector shields to absorb incoming kinetic and high-energy projectiles.", color: "rgba(20,184,166,0.5)" },
            { icon: Rocket, title: "Evasion Tactics", desc: "Harness afterburner thrusters for maximum evasion — dodge fatal kill shots.", color: "rgba(139,92,246,0.5)" },
          ].map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ y: -4 }}
              className="bg-card/80 backdrop-blur-md border border-border border-t-2 p-8 flex flex-col items-center text-center transition-all group relative overflow-hidden cursor-default"
              style={{ borderTopColor: feat.color.replace("0.5", "0.8"), clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)' }}
            >
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-10 group-hover:opacity-25 transition-all duration-500" style={{ backgroundColor: feat.color }} />
              <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full blur-2xl opacity-5 group-hover:opacity-15 transition-all duration-500" style={{ backgroundColor: feat.color }} />

              <motion.div
                className="w-20 h-20 flex items-center justify-center mb-6 relative"
                whileHover={{ rotate: 15 }}
                style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
              >
                <div className="absolute inset-0 border border-white/10 group-hover:border-white/20 transition-colors"
                  style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', backgroundColor: feat.color.replace("0.5", "0.12") }}
                />
                <feat.icon className="w-9 h-9 relative z-10" style={{ color: feat.color.replace("0.5", "1"), filter: `drop-shadow(0 0 8px ${feat.color})` }} />
              </motion.div>

              <h3 className="text-2xl font-bold font-display uppercase tracking-widest mb-4 text-white group-hover:text-primary transition-colors">{feat.title}</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Lore */}
      <section className="relative py-32 bg-background border-y-4 border-l-4 border-l-primary border-y-border overflow-hidden z-20">
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
        />
        <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
          <motion.h2
            className="text-3xl font-black font-display mb-12 tracking-[0.3em] uppercase text-primary drop-shadow-[0_0_15px_rgba(255,120,0,0.5)]"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          >
            The Void Beckons
          </motion.h2>

          <div className="relative">
            <span className="absolute -top-10 -left-6 text-8xl font-display text-primary/15 leading-none select-none">"</span>
            <motion.p
              className="text-2xl md:text-3xl text-muted-foreground/90 italic leading-relaxed mb-8 font-light relative z-10"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              For three millennia, the Astral Empire maintained peace. But the discovery of Zyrvath shattered the galaxy. Now, warlords battle in the ruins of dead star systems.
            </motion.p>
            <motion.p
              className="text-xl md:text-2xl text-white italic leading-relaxed mb-12 relative z-10 font-medium"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              You are a Commander. Your ship is your life. The void is unforgiving.
            </motion.p>
            <span className="absolute -bottom-14 -right-6 text-8xl font-display text-primary/15 leading-none select-none">"</span>
          </div>

          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
          >
            <Link href="/demo" className="inline-flex items-center gap-2 text-primary font-display font-bold tracking-widest uppercase hover:text-white transition-colors hover:drop-shadow-[0_0_8px_rgba(255,120,0,0.8)]">
              Enter the Simulator <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Ship Preview */}
      <section className="py-24 px-4 max-w-7xl mx-auto relative z-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <motion.h2 className="text-4xl md:text-5xl font-black font-display mb-4 text-white uppercase tracking-wider"
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            >
              Select Your Vessel
            </motion.h2>
            <div className="h-1 w-24 bg-primary shadow-[0_0_10px_rgba(255,120,0,0.8)]" />
          </div>
          <Link href="/ships" className="inline-flex items-center gap-2 text-primary font-display font-bold tracking-widest uppercase hover:text-white transition-colors group">
            View All 18 Ships <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="flex overflow-x-auto pb-8 md:pb-0 md:grid md:grid-cols-3 gap-6 snap-x">
          {featuredShips.map((ship, idx) => {
            const col = tierColors[ship.tier as keyof typeof tierColors] ?? "#ff7800";
            return (
              <motion.div
                key={ship.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="min-w-[85vw] md:min-w-0 snap-center bg-black/50 backdrop-blur-md border border-primary/20 p-6 flex flex-col relative group [clip-path:polygon(0_0,calc(100%-16px)_0,100%_16px,100%_100%,16px_100%,0_calc(100%-16px))] hover:border-primary/50 transition-all cursor-default"
              >
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-8 group-hover:opacity-18 transition-opacity duration-500" style={{ backgroundColor: col }} />

                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div>
                    <h3 className="text-xl font-black font-display text-white uppercase tracking-wider group-hover:text-primary transition-colors">{ship.name}</h3>
                    <span className="text-xs font-bold tracking-widest font-display uppercase mt-1 block" style={{ color: col }}>
                      {ship.tier === 1 ? "Scout" : ship.tier === 3 ? "Cruiser" : "Sovereign"}
                    </span>
                  </div>
                  <span className="px-3 py-1 text-xs font-black font-display tracking-widest border bg-background/40"
                    style={{ color: col, borderColor: `${col}50` }}>
                    TIER {ship.tier}
                  </span>
                </div>

                <div className="space-y-3.5 mb-6 relative z-10 flex-grow">
                  {[
                    { label: "Hull Integrity", val: ship.hp, max: 400, color: "#ef4444" },
                    { label: "Attack Power", val: ship.attack, max: 200, color: "#ff7800" },
                    { label: "Shields", val: ship.shield, max: 100, color: "#2dd4bf" },
                  ].map(stat => (
                    <div key={stat.label}>
                      <div className="flex justify-between text-xs font-bold font-display uppercase tracking-wider text-muted-foreground mb-1">
                        <span>{stat.label}</span>
                        <span className="font-mono text-white">{stat.val}</span>
                      </div>
                      <div className="h-1.5 w-full bg-background/60 overflow-hidden border border-border/30">
                        <motion.div
                          className="h-full"
                          style={{ backgroundColor: stat.color }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(stat.val / stat.max) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + idx * 0.1, duration: 0.7, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Link href="/ships"
                  className="relative z-10 text-center text-xs font-bold font-display uppercase tracking-widest text-primary/60 hover:text-primary transition-colors flex items-center justify-center gap-1 group/btn"
                >
                  View Full Stats <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Leaderboard Teaser */}
      <section className="py-24 px-4 max-w-5xl mx-auto relative z-20 w-full mb-12">
        <div className="text-center mb-12">
          <motion.h2 className="text-4xl md:text-5xl font-black font-display mb-4 text-white uppercase tracking-wider"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
            Top Commanders
          </motion.h2>
          <div className="h-1 w-24 bg-primary mx-auto shadow-[0_0_10px_rgba(255,120,0,0.8)] mb-6" />
        </div>

        <motion.div
          className="bg-card/80 backdrop-blur-md border border-border border-l-4 border-l-primary shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        >
          <div className="absolute inset-0 pointer-events-none opacity-[0.07]"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,120,0,0.15) 2px, rgba(255,120,0,0.15) 3px)' }}
          />
          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-background/50">
                  {["Rank", "Commander", "Rating (ELO)", "Title"].map(h => (
                    <th key={h} className="p-6 font-display text-xs font-bold tracking-widest uppercase text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {topCommanders.map((cmd, i) => (
                  <motion.tr key={cmd.name}
                    initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    className="hover:bg-primary/5 transition-colors"
                  >
                    <td className="p-6 font-display font-black text-2xl">
                      <span className={`inline-flex items-center justify-center w-9 h-9 border text-sm font-black ${
                        cmd.rank === 1 ? "bg-amber-500/25 text-amber-300 border-amber-400/60 shadow-[0_0_12px_rgba(245,158,11,0.6)]" :
                        cmd.rank === 2 ? "bg-slate-300/20 text-slate-200 border-slate-300/50" :
                        "bg-orange-700/20 text-orange-400 border-orange-600/50"
                      } [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]`}>
                        {cmd.rank}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className="font-bold text-white text-base tracking-wide">{cmd.name}</span>
                    </td>
                    <td className="p-6 font-mono text-primary font-bold text-lg drop-shadow-[0_0_5px_rgba(255,120,0,0.5)]">
                      {cmd.elo.toLocaleString()}
                    </td>
                    <td className="p-6">
                      <span className="px-3 py-1 bg-background text-muted-foreground text-xs font-bold uppercase tracking-widest border border-border">
                        {cmd.militaryRank}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <div className="text-center mt-10">
          <Button asChild variant="outline" data-testid="button-view-leaderboard"
            className="h-12 px-8 font-display font-bold tracking-widest uppercase border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all hover:scale-105 [clip-path:polygon(0_0,calc(100%-8px)_0,100%_8px,100%_100%,8px_100%,0_calc(100%-8px))]"
          >
            <Link href="/leaderboard" className="flex items-center gap-2">
              Full Standings <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="relative z-20 text-center text-sm font-display tracking-widest uppercase text-muted-foreground border-t border-border bg-background py-8">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="h-px w-16 bg-border" />
          <span>&copy; {new Date().getFullYear()} ZYRVATH</span>
          <div className="h-px w-16 bg-border" />
        </div>
        <p className="text-primary/50 text-xs">All systems nominal. The void awaits.</p>
      </footer>
    </div>
  );
}
