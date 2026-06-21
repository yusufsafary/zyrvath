import { Link, useLocation } from "wouter";
import { Home, Gamepad2, Rocket, Trophy } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/demo", label: "Demo", icon: Gamepad2 },
    { href: "/ships", label: "Ships", icon: Rocket },
    { href: "/leaderboard", label: "Leaders", icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-16 md:pb-0 pt-0 md:pt-16 dark">
      {/* Desktop Top Nav */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-md border-b border-border z-50 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Rocket className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold tracking-wider text-white">ZYRVATH</span>
        </div>
        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} data-testid={`link-desktop-${item.label.toLowerCase()}`} className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${location === item.href ? "text-primary" : "text-muted-foreground"}`}>
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto p-4 md:p-6 min-h-[calc(100vh-4rem)]">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card/90 backdrop-blur-md border-t border-border z-50 flex items-center justify-around px-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} data-testid={`link-mobile-${item.label.toLowerCase()}`} className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${location === item.href ? "text-primary" : "text-muted-foreground"}`}>
            <item.icon className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
