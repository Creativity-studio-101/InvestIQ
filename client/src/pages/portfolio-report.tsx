import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { usePortfolioAnalysis } from "@/hooks/use-portfolio";
import AssetAllocationChart from "@/components/charts/asset-allocation-chart";
import PerformanceChart from "@/components/charts/performance-chart";
import { formatCurrency, formatPercentage, calculateAssetAllocation, generatePerformanceData } from "@/lib/financial-calculations";
import { Skeleton } from "@/components/ui/skeleton";
import { FileDown, FileSpreadsheet, Wand2 } from "lucide-react";

interface OptimizationSettings {
  goal: "max_return" | "max_sharpe" | "min_risk";
  riskTolerance: number;
  horizon: "short" | "medium" | "long";
}

export default function PortfolioReport() {
  const { data: analysis, isLoading } = usePortfolioAnalysis();
  const [optimizationSettings, setOptimizationSettings] = useState<OptimizationSettings>({
    goal: "max_sharpe",
    riskTolerance: 6,
    horizon: "medium"
  });
  const [showOptimization, setShowOptimization] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] px-8 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!analysis || !analysis.portfolio.length) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] px-8 py-8">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4 text-[#e4e6ea]">No Portfolio Data</h1>
          <p className="text-[#8b949e] mb-8">Please add some portfolio items first to generate a report.</p>
          <Button className="bg-[#00d4aa] hover:bg-[#00d4aa]/80 text-[#1a1a2e]">
            Add Portfolio Items
          </Button>
        </div>
      </div>
    );
  }

  const assetAllocation = calculateAssetAllocation(analysis.portfolio);
  const performanceData = generatePerformanceData(analysis.portfolio);

  const optimizationResult = {
    expectedReturn: 14.2,
    expectedRisk: 12.8,
    sharpeRatio: 1.11,
    allocation: [
      { asset: "Large Cap Stocks", percentage: 45 },
      { asset: "Mid Cap Stocks", percentage: 25 },
      { asset: "Small Cap Stocks", percentage: 15 },
      { asset: "International Equity", percentage: 10 },
      { asset: "Bonds", percentage: 5 }
    ]
  };

  const handleOptimize = () => {
    setShowOptimization(true);
  };

  const handleDownloadPDF = () => {
    // In a real implementation, this would generate and download a PDF report
    alert("PDF download functionality would be implemented here");
  };

  const handleDownloadCSV = () => {
    // In a real implementation, this would generate and download a CSV export
    const csvContent = analysis.portfolio.map(item => 
      `${item.name},${item.units},${item.buyingPrice},${item.purchaseDate},${item.type},${item.currentValue || 0},${item.pnl || 0}`
    ).join('\n');
    
    const header = "Name,Units,Buying Price,Purchase Date,Type,Current Value,P&L\n";
    const blob = new Blob([header + csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-analysis.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getRiskToleranceText = (value: number) => {
    if (value <= 3) return "Conservative";
    if (value <= 7) return "Moderate";
    return "Aggressive";
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-[#e4e6ea]">Portfolio Analysis Report</h1>
        <p className="text-[#8b949e]">Comprehensive analysis of your investment portfolio performance</p>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-[rgba(26,26,46,0.8)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)]">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold font-mono mb-2 text-[#e4e6ea]">
              {formatCurrency(analysis.summary.totalInvested)}
            </div>
            <div className="text-[#8b949e] text-sm">Total Invested</div>
          </CardContent>
        </Card>
        <Card className="bg-[rgba(26,26,46,0.8)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)]">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold font-mono mb-2 text-[#e4e6ea]">
              {formatCurrency(analysis.summary.currentValue)}
            </div>
            <div className="text-[#8b949e] text-sm">Current Value</div>
          </CardContent>
        </Card>
        <Card className="bg-[rgba(26,26,46,0.8)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)]">
          <CardContent className="p-6 text-center">
            <div className={`text-3xl font-bold font-mono mb-2 ${analysis.summary.totalPnL >= 0 ? 'text-[#00d4aa]' : 'text-[#ff6b6b]'}`}>
              {analysis.summary.totalPnL >= 0 ? '+' : ''}{formatCurrency(analysis.summary.totalPnL)}
            </div>
            <div className="text-[#8b949e] text-sm">Total P&L</div>
          </CardContent>
        </Card>
        <Card className="bg-[rgba(26,26,46,0.8)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)]">
          <CardContent className="p-6 text-center">
            <div className={`text-3xl font-bold font-mono mb-2 ${analysis.summary.returnPercentage >= 0 ? 'text-[#00d4aa]' : 'text-[#ff6b6b]'}`}>
              {formatPercentage(analysis.summary.returnPercentage)}
            </div>
            <div className="text-[#8b949e] text-sm">Return %</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Asset Allocation Pie Chart */}
        <Card className="bg-[rgba(26,26,46,0.8)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)]">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[#e4e6ea]">Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <AssetAllocationChart data={assetAllocation} />
            <div className="mt-4 space-y-2">
              {assetAllocation.map((asset) => (
                <div key={asset.type} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: asset.color }}
                    />
                    <span className="text-[#e4e6ea]">{asset.type}</span>
                  </div>
                  <span className="font-mono text-[#e4e6ea]">{asset.percentage.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Performance Graph */}
        <Card className="bg-[rgba(26,26,46,0.8)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)]">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[#e4e6ea]">Portfolio Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceChart data={performanceData} />
          </CardContent>
        </Card>
      </div>

      {/* Risk Analysis */}
      <Card className="bg-[rgba(26,26,46,0.8)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)] mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-[#e4e6ea]">Risk Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold font-mono mb-2 text-[#e4e6ea]">
                {analysis.riskMetrics.beta.toFixed(2)}
              </div>
              <div className="text-sm text-[#8b949e]">Beta</div>
              <div className="text-xs text-[#ffd93d] mt-1">Moderate Risk</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-mono mb-2 text-[#e4e6ea]">
                {analysis.riskMetrics.sharpeRatio.toFixed(2)}
              </div>
              <div className="text-sm text-[#8b949e]">Sharpe Ratio</div>
              <div className="text-xs text-[#00d4aa] mt-1">Good</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-mono mb-2 text-[#e4e6ea]">
                {analysis.riskMetrics.maxDrawdown.toFixed(1)}%
              </div>
              <div className="text-sm text-[#8b949e]">Max Drawdown</div>
              <div className="text-xs text-[#ffd93d] mt-1">Acceptable</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-mono mb-2 text-[#e4e6ea]">
                {analysis.riskMetrics.standardDeviation.toFixed(1)}%
              </div>
              <div className="text-sm text-[#8b949e]">Std Deviation</div>
              <div className="text-xs text-[#ffd93d] mt-1">Moderate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-mono mb-2 text-[#e4e6ea]">
                {analysis.riskMetrics.volatility.toFixed(1)}%
              </div>
              <div className="text-sm text-[#8b949e]">Volatility</div>
              <div className="text-xs text-[#00d4aa] mt-1">Low</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Optimizer */}
      <Card className="bg-[rgba(26,26,46,0.8)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)] mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-[#e4e6ea]">Portfolio Optimizer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium mb-4 text-[#e4e6ea]">Optimization Settings</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#e4e6ea]">Optimization Goal</label>
                  <Select 
                    value={optimizationSettings.goal} 
                    onValueChange={(value) => setOptimizationSettings(prev => ({ ...prev, goal: value as any }))}
                  >
                    <SelectTrigger className="bg-[#16213e] border-gray-600 text-[#e4e6ea]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#16213e] border-gray-600">
                      <SelectItem value="max_return">Maximize Return</SelectItem>
                      <SelectItem value="max_sharpe">Maximize Sharpe Ratio</SelectItem>
                      <SelectItem value="min_risk">Minimize Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#e4e6ea]">Risk Tolerance</label>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-[#8b949e]">Conservative</span>
                    <Slider
                      value={[optimizationSettings.riskTolerance]}
                      onValueChange={(value) => setOptimizationSettings(prev => ({ ...prev, riskTolerance: value[0] }))}
                      max={10}
                      min={1}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-[#8b949e]">Aggressive</span>
                  </div>
                  <div className="text-center mt-2 text-sm text-[#8b949e]">
                    Current: <span className="font-medium text-[#e4e6ea]">
                      {getRiskToleranceText(optimizationSettings.riskTolerance)} ({optimizationSettings.riskTolerance}/10)
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#e4e6ea]">Investment Horizon</label>
                  <Select 
                    value={optimizationSettings.horizon} 
                    onValueChange={(value) => setOptimizationSettings(prev => ({ ...prev, horizon: value as any }))}
                  >
                    <SelectTrigger className="bg-[#16213e] border-gray-600 text-[#e4e6ea]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#16213e] border-gray-600">
                      <SelectItem value="short">Short Term (&lt; 1 year)</SelectItem>
                      <SelectItem value="medium">Medium Term (1-5 years)</SelectItem>
                      <SelectItem value="long">Long Term (&gt; 5 years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleOptimize}
                  className="w-full bg-[#0f3460] hover:bg-[#0f3460]/80 text-[#e4e6ea] font-medium"
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  Optimize Portfolio
                </Button>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-4 text-[#e4e6ea]">Optimization Results</h4>
              {showOptimization ? (
                <div className="space-y-4">
                  <div className="bg-[#16213e] rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-[#8b949e]">Expected Annual Return</span>
                      <span className="font-mono font-semibold text-[#00d4aa]">
                        {optimizationResult.expectedReturn.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-[#8b949e]">Expected Risk (Volatility)</span>
                      <span className="font-mono font-semibold text-[#ffd93d]">
                        {optimizationResult.expectedRisk.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#8b949e]">Sharpe Ratio</span>
                      <span className="font-mono font-semibold text-[#e4e6ea]">
                        {optimizationResult.sharpeRatio.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium mb-3 text-[#e4e6ea]">Recommended Allocation</h5>
                    <div className="space-y-2">
                      {optimizationResult.allocation.map((allocation) => (
                        <div key={allocation.asset} className="flex justify-between items-center text-sm">
                          <span className="text-[#e4e6ea]">{allocation.asset}</span>
                          <span className="font-mono text-[#e4e6ea]">{allocation.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-[#8b949e] mb-4">Click "Optimize Portfolio" to see recommendations</p>
                  <div className="bg-[#16213e] rounded-xl p-4">
                    <p className="text-sm text-[#8b949e]">Optimization will consider your:</p>
                    <ul className="text-sm text-[#e4e6ea] mt-2 space-y-1">
                      <li>• Current portfolio composition</li>
                      <li>• Risk tolerance preferences</li>
                      <li>• Investment time horizon</li>
                      <li>• Market conditions</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <div className="flex justify-center space-x-4">
        <Button 
          onClick={handleDownloadPDF}
          className="bg-[#00d4aa] hover:bg-[#00d4aa]/80 text-[#1a1a2e] px-8 py-3 font-medium"
        >
          <FileDown className="mr-2 h-4 w-4" />
          Download PDF Report
        </Button>
        <Button 
          variant="outline"
          onClick={handleDownloadCSV}
          className="border-gray-600 hover:bg-gray-600 text-[#e4e6ea] px-8 py-3 font-medium"
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export as CSV
        </Button>
      </div>
    </div>
  );
}
