import { motion } from "framer-motion";
import { Link } from "wouter";
import { Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative z-20 px-4">
      <div className="flex flex-col items-center text-center max-w-2xl">

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative mb-8"
        >
          <div
            className="text-[10rem] md:text-[14rem] font-black font-display text-transparent leading-none select-none"
            style={{
              WebkitTextStroke: '2px rgba(255,120,0,0.3)',
              textShadow: '0 0 80px rgba(255,120,0,0.15)',
            }}
          >
            404
          </div>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <AlertTriangle className="w-16 h-16 md:w-24 md:h-24 text-primary drop-shadow-[0_0_30px_rgba(255,120,0,0.9)]" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[1px] w-12 bg-primary/40" />
            <span className="text-primary font-display font-bold tracking-[0.4em] uppercase text-sm">
              Sector Not Found
            </span>
            <div className="h-[1px] w-12 bg-primary/40" />
          </div>

          <h1 className="text-3xl md:text-5xl font-black font-display text-white uppercase tracking-widest mb-4 drop-shadow-[0_0_20px_rgba(255,120,0,0.4)]">
            Lost in the Void
          </h1>

          <p className="text-lg text-muted-foreground mb-3 leading-relaxed max-w-lg mx-auto">
            This sector has been consumed by the void. Navigation systems offline. Coordinates unknown.
          </p>
          <p className="text-sm text-muted-foreground/60 font-mono mb-10">
            ERROR_CODE: SECTOR_NULL — COORDINATES: [REDACTED]
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="h-13 px-10 font-black font-display uppercase tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(255,120,0,0.4)] hover:shadow-[0_0_40px_rgba(255,120,0,0.6)] transition-all hover:scale-105 [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%-10px))] border-none"
            >
              <Link href="/" className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Return to Base
              </Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="mt-16 grid grid-cols-3 gap-8 text-center opacity-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 0.8 }}
        >
          {["HULL", "SHIELD", "ENGINE"].map((sys) => (
            <div key={sys} className="flex flex-col items-center gap-1">
              <div className="h-1 w-16 bg-red-500 animate-pulse" />
              <span className="text-[10px] font-display font-bold tracking-widest text-red-500 uppercase">{sys} OFFLINE</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
