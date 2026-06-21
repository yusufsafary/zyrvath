import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Rocket, Shield, Zap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function Starfield() {
  const [stars, setStars] = useState<{ id: number; x: number; y: number; size: number; duration: number }[]>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full opacity-50"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col gap-16 md:gap-32 pb-16">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center rounded-3xl overflow-hidden border border-border bg-card/30">
        <Starfield />
        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white drop-shadow-[0_0_15px_rgba(37,99,235,0.5)]">
              ZYRVATH
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Command a warship through a dying galaxy. Dangerous, tense, and thrilling space battles where every decision matters.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
              <Button asChild size="lg" data-testid="button-enter-simulator" className="h-14 px-8 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all hover:scale-105">
                <Link href="/demo">ENTER SIMULATOR</Link>
              </Button>
              <Button asChild size="lg" variant="outline" data-testid="button-view-fleet" className="h-14 px-8 text-lg border-primary/50 text-primary hover:bg-primary/10">
                <Link href="/ships">VIEW FLEET</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">TACTICAL WARFARE</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Master the triad of space combat. Positioning, timing, and raw firepower.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Zap, title: "Devastating Firepower", desc: "Equip plasma rays and singularity cannons to pierce enemy hulls." },
            { icon: Shield, title: "Defensive Matrix", desc: "Manage deflector shields to absorb incoming kinetic and energy damage." },
            { icon: Rocket, title: "Evasive Maneuvers", desc: "Utilize thrusters for high evasion rates, dodging fatal blows." }
          ].map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="bg-card border border-border p-8 rounded-2xl flex flex-col items-center text-center hover:border-primary/50 transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <feat.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
              <p className="text-muted-foreground">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Lore Section */}
      <section className="bg-card border-y border-border py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-primary drop-shadow-[0_0_10px_rgba(37,99,235,0.3)]">THE FALL OF THE ASTRAL EMPIRE</h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            For three millennia, the Astral Empire maintained peace across the Orion Arm. But the discovery of Zyrvath—a dark energy source of limitless potential—shattered the galaxy. Now, warlords, scavengers, and remnants of the Imperial Fleet battle in the ruins of dead star systems.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            You are a Commander. Your ship is your life. The void is unforgiving. Will you conquer the stars, or be consumed by the dark?
          </p>
        </div>
      </section>

      {/* Leaderboard Teaser */}
      <section className="px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">THE ELITE COMMANDERS</h2>
        <p className="text-muted-foreground mb-8">Only the strongest survive the void. See where you stand.</p>
        <Button asChild variant="outline" data-testid="button-view-leaderboard" className="h-12 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all">
          <Link href="/leaderboard" className="flex items-center gap-2">
            VIEW LEADERBOARD <ChevronRight className="w-4 h-4" />
          </Link>
        </Button>
      </section>
      
      <footer className="text-center text-sm text-muted-foreground border-t border-border pt-8 mt-8">
        <p>&copy; {new Date().getFullYear()} ZYRVATH. All systems nominal.</p>
      </footer>
    </div>
  );
}
