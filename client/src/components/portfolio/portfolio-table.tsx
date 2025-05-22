import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePortfolio, useDeletePortfolioItem } from "@/hooks/use-portfolio";
import { useMarketData } from "@/hooks/use-market-data";
import { formatCurrency, formatPercentage, calculatePnL } from "@/lib/financial-calculations";
import { Trash2, BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface PortfolioTableProps {
  onAnalyze?: () => void;
}

export default function PortfolioTable({ onAnalyze }: PortfolioTableProps) {
  const { data: portfolioItems, isLoading } = usePortfolio();
  const { data: marketData } = useMarketData();
  const deletePortfolioItem = useDeletePortfolioItem();

  if (isLoading) {
    return (
      <Card className="bg-[rgba(26,26,46,0.8)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)]">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#16213e] rounded-xl p-4">
                <Skeleton className="h-5 w-32 mb-2" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const enrichedPortfolio = portfolioItems?.map((item: any) => {
    const units = parseFloat(item.units);
    const buyingPrice = parseFloat(item.buyingPrice);
    const invested = units * buyingPrice;
    
    // Find current market price
    const marketItem = marketData?.find((m: any) => 
      m.symbol === item.symbol || m.name === item.name
    );
    const currentPrice = marketItem ? parseFloat(marketItem.price) : buyingPrice;
    const currentValue = units * currentPrice;
    
    const { pnl, pnlPercent } = calculatePnL(invested, currentValue);
    
    return {
      ...item,
      invested,
      currentValue,
      pnl,
      pnlPercent,
      currentPrice
    };
  }) || [];

  const totals = enrichedPortfolio.reduce((acc, item) => ({
    invested: acc.invested + item.invested,
    currentValue: acc.currentValue + item.currentValue,
    pnl: acc.pnl + item.pnl
  }), { invested: 0, currentValue: 0, pnl: 0 });

  const totalReturnPercent = totals.invested > 0 ? (totals.pnl / totals.invested) * 100 : 0;

  return (
    <Card className="bg-[rgba(26,26,46,0.8)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-[#e4e6ea]">Current Portfolio</CardTitle>
          <span className="text-sm text-[#8b949e]">{enrichedPortfolio.length} holdings</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          {enrichedPortfolio.map((item) => (
            <div key={item.id} className="bg-[#16213e] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-[#e4e6ea]">{item.name}</h4>
                  <p className="text-sm text-[#8b949e]">{item.type}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-[#ff6b6b] hover:text-[#ff6b6b]/80 hover:bg-[#ff6b6b]/10"
                  onClick={() => deletePortfolioItem.mutate(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-[#8b949e]">Units: </span>
                  <span className="font-mono text-[#e4e6ea]">{item.units}</span>
                </div>
                <div>
                  <span className="text-[#8b949e]">Avg Price: </span>
                  <span className="font-mono text-[#e4e6ea]">{formatCurrency(parseFloat(item.buyingPrice))}</span>
                </div>
                <div>
                  <span className="text-[#8b949e]">Invested: </span>
                  <span className="font-mono text-[#e4e6ea]">{formatCurrency(item.invested)}</span>
                </div>
                <div>
                  <span className="text-[#8b949e]">Current: </span>
                  <span className="font-mono text-[#00d4aa]">{formatCurrency(item.currentValue)}</span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-600">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#8b949e]">P&L:</span>
                  <span className={`font-mono ${item.pnl >= 0 ? 'text-[#00d4aa]' : 'text-[#ff6b6b]'}`}>
                    {item.pnl >= 0 ? '+' : ''}{formatCurrency(item.pnl)} ({formatPercentage(item.pnlPercent)})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {enrichedPortfolio.length > 0 && (
          <div className="border-t border-gray-600 pt-4">
            <div className="text-center mb-4">
              <div className="text-2xl font-bold font-mono text-[#e4e6ea]">
                {formatCurrency(totals.currentValue)}
              </div>
              <div className="text-sm text-[#8b949e]">Total Portfolio Value</div>
              <div className={`font-medium ${totals.pnl >= 0 ? 'text-[#00d4aa]' : 'text-[#ff6b6b]'}`}>
                {totals.pnl >= 0 ? '+' : ''}{formatCurrency(totals.pnl)} ({formatPercentage(totalReturnPercent)})
              </div>
            </div>
            {onAnalyze && (
              <Button 
                onClick={onAnalyze}
                className="w-full bg-[#0f3460] hover:bg-[#0f3460]/80 text-[#e4e6ea] font-medium"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Generate Analysis Report
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
