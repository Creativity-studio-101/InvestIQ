import { useMarketData } from "@/hooks/use-market-data";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bitcoin, DollarSign } from "lucide-react";
import { formatPercentage } from "@/lib/financial-calculations";

export default function CryptoPrices() {
  const { data: marketData, isLoading } = useMarketData();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-[rgba(26,26,46,0.8)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)]">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-3 w-8" />
                </div>
              </div>
              <Skeleton className="h-6 w-24 mb-1" />
              <Skeleton className="h-4 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cryptos = marketData?.filter(item => 
    ["BTC", "ETH", "SOL", "ADA"].includes(item.symbol)
  ) || [];

  const getCryptoIcon = (symbol: string) => {
    switch (symbol) {
      case "BTC":
        return <Bitcoin className="text-[#ffd93d]" />;
      case "ETH":
        return <DollarSign className="text-blue-400" />;
      case "SOL":
        return <DollarSign className="text-purple-400" />;
      case "ADA":
        return <DollarSign className="text-green-400" />;
      default:
        return <DollarSign className="text-[#8b949e]" />;
    }
  };

  const getCryptoBgColor = (symbol: string) => {
    switch (symbol) {
      case "BTC":
        return "bg-[#ffd93d]/20";
      case "ETH":
        return "bg-blue-500/20";
      case "SOL":
        return "bg-purple-500/20";
      case "ADA":
        return "bg-green-500/20";
      default:
        return "bg-[#8b949e]/20";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {cryptos.map((crypto) => {
        const change = parseFloat(crypto.changePercent);
        const isPositive = change >= 0;
        
        return (
          <Card 
            key={crypto.symbol} 
            className="bg-[rgba(26,26,46,0.8)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)] hover:scale-105 transition-all duration-200"
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-10 h-10 ${getCryptoBgColor(crypto.symbol)} rounded-full flex items-center justify-center`}>
                  {getCryptoIcon(crypto.symbol)}
                </div>
                <div>
                  <div className="font-semibold text-[#e4e6ea]">{crypto.name}</div>
                  <div className="text-sm text-[#8b949e] font-mono">{crypto.symbol}</div>
                </div>
              </div>
              <div className="font-mono text-xl font-bold mb-1 text-[#e4e6ea]">
                ${parseFloat(crypto.price).toLocaleString()}
              </div>
              <div className={`text-sm font-medium ${isPositive ? 'text-[#00d4aa]' : 'text-[#ff6b6b]'}`}>
                {formatPercentage(change)}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
