import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Newspaper, 
  BarChart3, 
  PlusCircle, 
  Upload,
  TrendingUp
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Market News", href: "/news", icon: Newspaper },
  { name: "Analyze Portfolio", href: "/analyze", icon: BarChart3 },
  { name: "Add Holdings", href: "/add-data", icon: PlusCircle },
  { name: "Upload CSV", href: "/upload", icon: Upload },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-[#1a1a2e] to-[#16213e] border-r border-gray-700 z-40">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-[#00d4aa] rounded-xl flex items-center justify-center">
            <TrendingUp className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#e4e6ea]">InvestIQ</h1>
            <p className="text-xs text-[#8b949e]">Portfolio Analytics</p>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-[rgba(0,212,170,0.2)] text-[#00d4aa]"
                    : "text-[#e4e6ea] hover:bg-white hover:bg-opacity-10"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* Portfolio Value Display */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-[rgba(26,26,46,0.8)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)] rounded-xl p-4 text-center">
          <div className="text-[#00d4aa] font-mono text-2xl font-bold">₹2,45,680</div>
          <div className="text-sm text-[#8b949e]">Portfolio Value</div>
          <div className="text-[#00d4aa] text-sm font-medium">+12.4% Today</div>
        </div>
      </div>
    </div>
  );
}
