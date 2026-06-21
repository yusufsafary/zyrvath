import { motion } from "framer-motion";
import { Link } from "wouter";
import { Rocket, Shield, Zap, ChevronDown, Crosshair, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ships } from "@/lib/game-data";
import { leaderboardData } from "@/lib/game-data";

export default function Home() {
  const featuredShips = ships.filter(s => [1, 3, 6].includes(s.tier)).slice(0, 3);
  const topCommanders = leaderboardData.slice(0, 3);

  return (
    <div className="flex flex-col gap-0">
      {/* Hero Section */}
      <section className="relative min-h-[100svh] w-full flex items-center justify-center overflow-hidden border-none bleed-edge -mt-16 md:mt-[-4rem]">
        
        {/* Decorative HUD Lines */}
        <motion.div 
          className="absolute top-1/4 left-0 h-[1px] bg-primary/20 w-1/3 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
        />
        <motion.div 
          className="absolute top-1/4 right-0 h-[1px] bg-primary/20 w-1/3 origin-right"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-0 h-[1px] bg-primary/20 w-1/4 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-0 h-[1px] bg-primary/20 w-1/4 origin-right"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
        />

        {/* Reticle Corners */}
        <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-primary/40" />
        <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-primary/40" />
        <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-primary/40" />
        <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-primary/40" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-5xl px-6 w-full mt-16">
          
          <motion.div
            className="flex justify-center flex-wrap mb-4"
            variants={{
              hidden: { opacity: 1 },
              visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
            }}
            initial="hidden"
            animate="visible"
          >
            {"ZYRVATH".split("").map((char, index) => (
              <motion.span
                key={index}
                className="text-4xl md:text-8xl font-black font-display tracking-[0.2em] text-white"
                style={{ textShadow: '0 0 30px rgba(255,120,0,0.6), 0 0 60px rgba(255,120,0,0.3), 0 0 100px rgba(255,120,0,0.1)' }}
                variants={{
                  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
                  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: "spring", damping: 12 } }
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>

          <motion.div 
            className="text-lg md:text-2xl font-display font-bold text-primary mb-2 tracking-widest h-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <TypewriterText text="COMMAND THE VOID. CONQUER THE STARS." />
          </motion.div>

          <motion.p 
            className="text-md md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3, duration: 1 }}
          >
            A dying galaxy. Endless battles. One commander.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row items-center gap-6 justify-center w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 3.5, duration: 0.5 }}
          >
            <Button asChild size="lg" data-testid="button-enter-simulator" className="w-full sm:w-auto h-14 px-10 text-lg font-black font-display uppercase tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(255,120,0,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,120,0,0.6)] relative overflow-hidden group [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))] border-none">
              <Link href="/demo">
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/50 transition-all z-10 [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))]"></div>
                <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-45deg] animate-[shimmer_2s_infinite]"></div>
                ENTER BATTLE
              </Link>
            </Button>
            
            <Button asChild size="lg" variant="outline" data-testid="button-view-fleet" className="w-full sm:w-auto h-14 px-10 text-lg font-bold font-display uppercase tracking-widest border-2 border-primary text-primary hover:bg-primary/10 transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(255,120,0,0.2)] bg-transparent [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))]">
              <Link href="/ships">VIEW FLEET</Link>
            </Button>
          </motion.div>
        </div>

        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-primary/50"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border/50 bg-card/60 backdrop-blur-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border/50 text-center">
          <div className="flex flex-col p-4">
            <span className="font-display font-black text-3xl text-primary drop-shadow-[0_0_10px_rgba(255,120,0,0.5)]">18</span>
            <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase mt-1">Warships</span>
          </div>
          <div className="flex flex-col p-4">
            <span className="font-display font-black text-3xl text-primary drop-shadow-[0_0_10px_rgba(255,120,0,0.5)]">6</span>
            <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase mt-1">Tiers</span>
          </div>
          <div className="flex flex-col p-4">
            <span className="font-display font-black text-3xl text-primary drop-shadow-[0_0_10px_rgba(255,120,0,0.5)]">11</span>
            <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase mt-1">Ranks</span>
          </div>
          <div className="flex flex-col p-4">
            <span className="font-display font-black text-2xl text-primary drop-shadow-[0_0_10px_rgba(255,120,0,0.5)] flex items-center justify-center h-[36px]">LIVE</span>
            <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase mt-1">Combat</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto relative z-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black font-display mb-4 text-white uppercase tracking-wider">Weapons of the Void</h2>
          <div className="h-1 w-24 bg-primary mx-auto shadow-[0_0_10px_rgba(255,120,0,0.8)] mb-6"></div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Master the triad of space combat. Positioning, timing, and raw firepower.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: "Attack Power", desc: "Equip plasma rays and singularity cannons to pierce enemy hulls." },
            { icon: Shield, title: "Shield Defense", desc: "Manage deflector shields to absorb incoming kinetic and energy damage." },
            { icon: Rocket, title: "Evasion Tactics", desc: "Utilize thrusters for high evasion rates, dodging fatal blows." }
          ].map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="bg-card/80 backdrop-blur-md border border-border border-t-primary border-t-2 p-8 flex flex-col items-center text-center hover:bg-card hover:shadow-[0_0_30px_rgba(255,120,0,0.1)] transition-all group relative overflow-hidden"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)' }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500"></div>
              
              <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)] border border-primary/30 group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(255,120,0,0.4)] transition-all duration-300">
                <feat.icon className="w-8 h-8 text-primary drop-shadow-[0_0_8px_rgba(255,120,0,0.6)]" />
              </div>
              <h3 className="text-2xl font-bold font-display uppercase tracking-widest mb-4 text-white">{feat.title}</h3>
              <p className="text-muted-foreground text-lg">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Lore Section */}
      <section className="relative py-32 bg-background border-y-4 border-l-4 border-l-primary border-y-border overflow-hidden z-20">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
        
        <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
          <h2 className="text-3xl font-black font-display mb-12 tracking-[0.3em] uppercase text-primary drop-shadow-[0_0_15px_rgba(255,120,0,0.4)]">The Void Beckons</h2>
          
          <div className="relative">
            <span className="absolute -top-12 -left-8 text-8xl font-display text-primary/20 leading-none">"</span>
            <p className="text-2xl md:text-3xl text-muted-foreground/90 italic leading-relaxed mb-8 font-light relative z-10">
              For three millennia, the Astral Empire maintained peace. But the discovery of Zyrvath shattered the galaxy. Now, warlords battle in the ruins of dead star systems.
            </p>
            <p className="text-xl md:text-2xl text-white italic leading-relaxed mb-12 relative z-10 font-medium">
              You are a Commander. Your ship is your life. The void is unforgiving.
            </p>
            <span className="absolute -bottom-16 -right-8 text-8xl font-display text-primary/20 leading-none">"</span>
          </div>

          <a href="#" className="inline-flex items-center gap-2 text-primary font-display font-bold tracking-widest uppercase hover:text-white transition-colors hover:drop-shadow-[0_0_8px_rgba(255,120,0,0.8)]">
            Read Intel Report <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Ship Preview Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto relative z-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black font-display mb-4 text-white uppercase tracking-wider">Select Your Vessel</h2>
            <div className="h-1 w-24 bg-primary shadow-[0_0_10px_rgba(255,120,0,0.8)]"></div>
          </div>
          <Link href="/ships" className="inline-flex items-center gap-2 text-primary font-display font-bold tracking-widest uppercase hover:text-white transition-colors">
            View All 18 Ships <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex overflow-x-auto pb-8 md:pb-0 md:grid md:grid-cols-3 gap-6 snap-x">
          {featuredShips.map((ship) => (
            <div key={ship.id} className="min-w-[85vw] md:min-w-0 snap-center bg-black/40 backdrop-blur-md border border-primary/20 p-6 flex flex-col relative group [clip-path:polygon(0_0,calc(100%-16px)_0,100%_16px,100%_100%,16px_100%,0_calc(100%-16px))] hover:border-primary/60 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <h3 className="text-2xl font-black font-display text-white uppercase tracking-wider">{ship.name}</h3>
                <span className={`px-3 py-1 text-xs font-black font-display tracking-widest border ${
                  ship.tier === 1 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : 
                  ship.tier === 3 ? "bg-amber-500/10 text-amber-400 border-amber-500/30" : 
                  "bg-red-500/10 text-red-400 border-red-500/30"
                }`}>
                  TIER {ship.tier}
                </span>
              </div>

              <div className="space-y-4 mb-8 relative z-10 flex-grow">
                <div>
                  <div className="flex justify-between text-xs font-bold font-display uppercase tracking-wider text-muted-foreground mb-1">
                    <span>Hull Integrity</span>
                    <span>{ship.hp}</span>
                  </div>
                  <div className="h-1.5 w-full bg-background overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: `${(ship.hp / 400) * 100}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold font-display uppercase tracking-wider text-muted-foreground mb-1">
                    <span>Attack Power</span>
                    <span>{ship.attack}</span>
                  </div>
                  <div className="h-1.5 w-full bg-background overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${(ship.attack / 200) * 100}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold font-display uppercase tracking-wider text-muted-foreground mb-1">
                    <span>Shields</span>
                    <span>{ship.shield}</span>
                  </div>
                  <div className="h-1.5 w-full bg-background overflow-hidden">
                    <div className="h-full bg-teal-400" style={{ width: `${(ship.shield / 100) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Leaderboard Teaser */}
      <section className="py-24 px-4 max-w-5xl mx-auto relative z-20 w-full mb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black font-display mb-4 text-white uppercase tracking-wider">Top Commanders</h2>
          <div className="h-1 w-24 bg-primary mx-auto shadow-[0_0_10px_rgba(255,120,0,0.8)] mb-6"></div>
        </div>

        <div className="bg-card/80 backdrop-blur-md border border-border border-l-4 border-l-primary shadow-2xl relative overflow-hidden">
          {/* Scanline effect */}
          <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,120,0,0.1) 2px, rgba(255,120,0,0.1) 4px)' }}></div>
          
          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-background/50">
                  <th className="p-6 font-display text-sm font-bold tracking-widest uppercase text-muted-foreground">Rank</th>
                  <th className="p-6 font-display text-sm font-bold tracking-widest uppercase text-muted-foreground">Commander</th>
                  <th className="p-6 font-display text-sm font-bold tracking-widest uppercase text-muted-foreground">Rating (ELO)</th>
                  <th className="p-6 font-display text-sm font-bold tracking-widest uppercase text-muted-foreground">Title</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {topCommanders.map((cmd) => (
                  <tr key={cmd.name} className="hover:bg-primary/5 transition-colors">
                    <td className="p-6 font-display font-black text-2xl text-primary/80">
                      0{cmd.rank}
                    </td>
                    <td className="p-6">
                      <span className="font-bold text-white text-lg tracking-wide">{cmd.name}</span>
                    </td>
                    <td className="p-6 font-mono text-primary font-bold text-lg drop-shadow-[0_0_5px_rgba(255,120,0,0.5)]">
                      {cmd.elo}
                    </td>
                    <td className="p-6">
                      <span className="px-3 py-1 bg-background text-muted-foreground text-xs font-bold uppercase tracking-widest border border-border">
                        {cmd.militaryRank}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Button asChild variant="outline" data-testid="button-view-leaderboard" className="h-12 px-8 font-display font-bold tracking-widest uppercase border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all [clip-path:polygon(0_0,calc(100%-8px)_0,100%_8px,100%_100%,8px_100%,0_calc(100%-8px))]">
            <Link href="/leaderboard" className="flex items-center gap-2">
              Full Standings <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>
      
      <footer className="relative z-20 text-center text-sm font-display tracking-widest uppercase text-muted-foreground border-t border-border bg-background py-8">
        <p>&copy; {new Date().getFullYear()} ZYRVATH. All systems nominal.</p>
      </footer>
    </div>
  );
}

// Typing effect component
import { useState, useEffect } from "react";
function TypewriterText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[index]);
        setIndex(index + 1);
      }, 50); // typing speed
      return () => clearTimeout(timeout);
    }
  }, [index, text]);

  return (
    <span>
      {displayedText}
      <span className="animate-pulse opacity-70">|</span>
    </span>
  );
}

