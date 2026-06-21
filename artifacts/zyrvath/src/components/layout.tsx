import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Home, Gamepad2, Rocket, Trophy } from "lucide-react";
import { SpaceBackground } from "./space-background";
import { ZyrvathLogo } from "./zyrvath-logo";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/demo", label: "Demo", icon: Gamepad2 },
    { href: "/ships", label: "Ships", icon: Rocket },
    { href: "/leaderboard", label: "Leaders", icon: Trophy },
  ];

  return (
    <div className="min-h-screen text-foreground pb-20 md:pb-0 pt-0 md:pt-16 dark relative">
      <SpaceBackground />
      
      {/* Desktop Top Nav */}
      <nav className={`hidden md:flex fixed top-0 left-0 right-0 h-16 z-50 items-center justify-between px-6 transition-all duration-300 ${scrolled ? 'bg-card/80 backdrop-blur-md border-b border-border shadow-lg' : 'bg-transparent border-transparent'}`}>
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary/80 overflow-hidden">
           <div className="h-full bg-white/50 w-1/3 animate-[pulse_2s_ease-in-out_infinite] blur-sm"></div>
        </div>
        <div className="flex items-center gap-2">
          <ZyrvathLogo size={32} className="drop-shadow-[0_0_10px_rgba(255,120,0,0.9)]" />
          <span className="text-2xl font-black tracking-widest text-white font-display drop-shadow-[0_0_8px_rgba(255,120,0,0.8)]">ZYRVATH</span>
        </div>
        <div className="flex items-center gap-8 h-full">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                data-testid={`link-desktop-${item.label.toLowerCase()}`} 
                className={`h-full flex items-center gap-2 text-sm font-bold tracking-widest font-display uppercase transition-colors relative ${isActive ? "text-primary" : "text-muted-foreground hover:text-white"}`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary shadow-[0_0_10px_rgba(255,120,0,0.8)]"></div>
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="w-full relative z-10 min-h-[calc(100vh-4rem)]">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-background/95 backdrop-blur-lg border-t border-border z-50 flex items-center justify-around px-2 pb-safe">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              data-testid={`link-mobile-${item.label.toLowerCase()}`} 
              className={`flex flex-col items-center justify-center w-16 h-full transition-all relative ${isActive ? "text-primary" : "text-muted-foreground"}`}
            >
              <item.icon className={`w-6 h-6 mb-1 ${isActive ? "drop-shadow-[0_0_8px_rgba(255,120,0,0.8)] scale-110" : ""}`} />
              <span className={`text-[10px] font-bold font-display uppercase tracking-wider ${isActive ? "text-primary" : ""}`}>{item.label}</span>
              {isActive && (
                 <div className="w-1 h-1 rounded-full bg-primary mt-1 shadow-[0_0_5px_rgba(255,120,0,1)]"></div>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  );
}
