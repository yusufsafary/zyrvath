export interface Ship {
  id: string;
  name: string;
  tier: number;
  attack: number;
  shield: number;
  hp: number;
  fire_rate: number;
  evasion: number;
}

export const ships: Ship[] = [
  { id: "s1", name: "Scout Sparrow", tier: 1, attack: 20, shield: 5, hp: 100, fire_rate: 15, evasion: 20 },
  { id: "s2", name: "Iron Hornet", tier: 1, attack: 25, shield: 8, hp: 90, fire_rate: 18, evasion: 15 },
  { id: "s3", name: "Nebula Dart", tier: 1, attack: 18, shield: 10, hp: 95, fire_rate: 22, evasion: 18 },
  { id: "s4", name: "Cosmic Mite", tier: 1, attack: 22, shield: 6, hp: 85, fire_rate: 25, evasion: 25 },
  
  { id: "s5", name: "Steel Falcon", tier: 2, attack: 35, shield: 15, hp: 130, fire_rate: 20, evasion: 18 },
  { id: "s6", name: "Viper X", tier: 2, attack: 40, shield: 12, hp: 120, fire_rate: 25, evasion: 12 },
  { id: "s7", name: "Astro Glider", tier: 2, attack: 30, shield: 20, hp: 140, fire_rate: 15, evasion: 10 },
  { id: "s8", name: "Plasma Ray", tier: 2, attack: 45, shield: 8, hp: 110, fire_rate: 28, evasion: 15 },
  
  { id: "s9", name: "Nova Hawk", tier: 3, attack: 55, shield: 25, hp: 160, fire_rate: 22, evasion: 14 },
  { id: "s10", name: "Crimson Wraith", tier: 3, attack: 60, shield: 20, hp: 150, fire_rate: 28, evasion: 10 },
  { id: "s11", name: "Void Stalker", tier: 3, attack: 50, shield: 30, hp: 170, fire_rate: 18, evasion: 12 },
  { id: "s12", name: "Star Piercer", tier: 3, attack: 65, shield: 15, hp: 145, fire_rate: 25, evasion: 16 },

  { id: "s13", name: "Titan Crusher", tier: 4, attack: 80, shield: 40, hp: 200, fire_rate: 25, evasion: 8 },
  { id: "s14", name: "Shadow Leviathan", tier: 4, attack: 75, shield: 45, hp: 210, fire_rate: 20, evasion: 10 },

  { id: "s15", name: "Void Emperor", tier: 5, attack: 110, shield: 60, hp: 270, fire_rate: 28, evasion: 6 },
  { id: "s16", name: "Apex Predator", tier: 5, attack: 120, shield: 55, hp: 260, fire_rate: 32, evasion: 5 },

  { id: "s17", name: "Omega Sovereign", tier: 6, attack: 160, shield: 85, hp: 350, fire_rate: 35, evasion: 4 },
  { id: "s18", name: "Singularity Dread", tier: 6, attack: 150, shield: 90, hp: 360, fire_rate: 30, evasion: 5 },
];

export interface LeaderboardEntry {
  rank: number;
  name: string;
  militaryRank: string;
  elo: number;
  wins: number;
  losses: number;
  winRate: number;
}

export const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: "Xerxes Vanguard", militaryRank: "Fleet Admiral", elo: 3450, wins: 890, losses: 110, winRate: 89.0 },
  { rank: 2, name: "Kaelen Voidwalker", militaryRank: "Fleet Admiral", elo: 3320, wins: 820, losses: 140, winRate: 85.4 },
  { rank: 3, name: "Vyrn Starblade", militaryRank: "Admiral", elo: 3150, wins: 750, losses: 180, winRate: 80.6 },
  { rank: 4, name: "Zara Eclipse", militaryRank: "Admiral", elo: 3080, wins: 700, losses: 190, winRate: 78.7 },
  { rank: 5, name: "Orion Flux", militaryRank: "Vice Admiral", elo: 2950, wins: 640, losses: 210, winRate: 75.3 },
  { rank: 6, name: "Lyra Moonshadow", militaryRank: "Vice Admiral", elo: 2890, wins: 610, losses: 230, winRate: 72.6 },
  { rank: 7, name: "Darius Thorne", militaryRank: "Rear Admiral", elo: 2750, wins: 550, losses: 250, winRate: 68.8 },
  { rank: 8, name: "Nova Stryker", militaryRank: "Rear Admiral", elo: 2680, wins: 520, losses: 260, winRate: 66.7 },
  { rank: 9, name: "Caelum Rift", militaryRank: "Commodore", elo: 2540, wins: 480, losses: 290, winRate: 62.3 },
  { rank: 10, name: "Elara Frost", militaryRank: "Commodore", elo: 2490, wins: 450, losses: 300, winRate: 60.0 },
  { rank: 11, name: "Ronan Pulse", militaryRank: "Captain", elo: 2350, wins: 410, losses: 320, winRate: 56.2 },
  { rank: 12, name: "Seraphina Dusk", militaryRank: "Captain", elo: 2280, wins: 390, losses: 330, winRate: 54.2 },
  { rank: 13, name: "Gaelen Spark", militaryRank: "Commander", elo: 2150, wins: 350, losses: 360, winRate: 49.3 },
  { rank: 14, name: "Talon Drift", militaryRank: "Commander", elo: 2090, wins: 330, losses: 370, winRate: 47.1 },
  { rank: 15, name: "Valeria Comet", militaryRank: "Lieutenant Commander", elo: 1950, wins: 290, losses: 390, winRate: 42.6 },
  { rank: 16, name: "Jaxon Flare", militaryRank: "Lieutenant", elo: 1880, wins: 260, losses: 410, winRate: 38.8 },
  { rank: 17, name: "Nyx Orbit", militaryRank: "Ensign", elo: 1750, wins: 220, losses: 440, winRate: 33.3 },
  { rank: 18, name: "Cassian Meteor", militaryRank: "Chief Petty Officer", elo: 1680, wins: 190, losses: 460, winRate: 29.2 },
  { rank: 19, name: "Aria Zenith", militaryRank: "Petty Officer", elo: 1550, wins: 150, losses: 490, winRate: 23.4 },
  { rank: 20, name: "Theron Quasar", militaryRank: "Recruit", elo: 1490, wins: 120, losses: 510, winRate: 19.0 }
];
