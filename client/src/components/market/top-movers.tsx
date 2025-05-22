import { useMarketData } from "@/hooks/use-market-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency, formatPercentage } from "@/lib/financial-calculations";

export default function TopMovers() {
  const { data: marketData, isLoading } = useMarketData();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[1, 2].map((i) => (
          <Card key={i} className="bg-[rgba(26,26,46,0.8)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)]">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-center justify-between py-3">
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stocks = marketData?.filter(item => 
    !["NIFTY50", "SENSEX", "NIFTYBANK", "BTC", "ETH", "SOL", "ADA"].includes(item.symbol)
  ) || [];

  const gainers = stocks
    .filter(stock => parseFloat(stock.changePercent) > 0)
    .sort((a, b) => parseFloat(b.changePercent) - parseFloat(a.changePercent))
    .slice(0, 5);

  const losers = stocks
    .filter(stock => parseFloat(stock.changePercent) < 0)
    .sort((a, b) => parseFloat(a.changePercent) - parseFloat(b.changePercent))
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Top Gainers */}
      <Card className="bg-[rgba(26,26,46,0.8)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 text-[#e4e6ea]">
            <div className="w-8 h-8 bg-[#00d4aa]/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-[#00d4aa] h-4 w-4" />
            </div>
            <span>Top Gainers</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gainers.map((stock) => (
              <div 
                key={stock.symbol} 
                className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0"
              >
                <div>
                  <div className="font-medium text-[#e4e6ea]">{stock.name}</div>
                  <div className="text-sm text-[#8b949e] font-mono">{stock.symbol}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-semibold text-[#e4e6ea]">
                    {formatCurrency(parseFloat(stock.price))}
                  </div>
                  <div className="text-[#00d4aa] text-sm font-medium">
                    {formatPercentage(parseFloat(stock.changePercent))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Losers */}
      <Card className="bg-[rgba(26,26,46,0.8)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 text-[#e4e6ea]">
            <div className="w-8 h-8 bg-[#ff6b6b]/20 rounded-lg flex items-center justify-center">
              <TrendingDown className="text-[#ff6b6b] h-4 w-4" />
            </div>
            <span>Top Losers</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {losers.map((stock) => (
              <div 
                key={stock.symbol} 
                className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0"
              >
                <div>
                  <div className="font-medium text-[#e4e6ea]">{stock.name}</div>
                  <div className="text-sm text-[#8b949e] font-mono">{stock.symbol}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-semibold text-[#e4e6ea]">
                    {formatCurrency(parseFloat(stock.price))}
                  </div>
                  <div className="text-[#ff6b6b] text-sm font-medium">
                    {formatPercentage(parseFloat(stock.changePercent))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
