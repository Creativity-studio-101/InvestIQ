import { useMarketData } from "@/hooks/use-market-data";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatPercentage } from "@/lib/financial-calculations";

export default function MarketIndices() {
  const { data: marketData, isLoading } = useMarketData();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-[rgba(26,26,46,0.8)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)]">
            <CardContent className="p-6">
              <Skeleton className="h-6 w-24 mb-4" />
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const indices = marketData?.filter(item => 
    ["NIFTY50", "SENSEX", "NIFTYBANK"].includes(item.symbol)
  ) || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {indices.map((index) => {
        const change = parseFloat(index.change);
        const changePercent = parseFloat(index.changePercent);
        const isPositive = change >= 0;
        
        return (
          <Card 
            key={index.symbol} 
            className="bg-[rgba(26,26,46,0.8)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)] hover:scale-105 transition-all duration-200"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-[#e4e6ea]">{index.name}</h3>
                <div className={`text-sm font-medium ${isPositive ? 'text-[#00d4aa]' : 'text-[#ff6b6b]'}`}>
                  {formatPercentage(changePercent)}
                </div>
              </div>
              <div className="font-mono text-3xl font-bold mb-2 text-[#e4e6ea]">
                {formatCurrency(parseFloat(index.price))}
              </div>
              <div className={`text-sm ${isPositive ? 'text-[#00d4aa]' : 'text-[#ff6b6b]'}`}>
                {isPositive ? '+' : ''}{formatCurrency(change)}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
