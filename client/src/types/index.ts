export interface MarketIndex {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
}

export interface Stock {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
}

export interface CryptoPrice {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  summary?: string;
  source: string;
  category: string;
  imageUrl?: string;
  sourceUrl?: string;
  publishedAt: Date;
  readTime?: string;
}

export interface PortfolioItem {
  id: number;
  name: string;
  symbol?: string;
  units: string;
  buyingPrice: string;
  purchaseDate: string;
  type: "Stock" | "SIP" | "Crypto";
  currentPrice?: string;
  invested?: number;
  currentValue?: number;
  pnl?: number;
  pnlPercent?: number;
}

export interface PortfolioSummary {
  totalInvested: number;
  currentValue: number;
  totalPnL: number;
  returnPercentage: number;
}

export interface RiskMetrics {
  beta: number;
  sharpeRatio: number;
  maxDrawdown: number;
  standardDeviation: number;
  volatility: number;
}

export interface PortfolioAnalysis {
  portfolio: PortfolioItem[];
  summary: PortfolioSummary;
  riskMetrics: RiskMetrics;
}

export interface CSVValidationResult {
  successful: number;
  failed: number;
  errors: string[];
}

export interface AssetAllocation {
  type: string;
  value: number;
  percentage: number;
  color: string;
}

export interface OptimizationSettings {
  goal: "max_return" | "max_sharpe" | "min_risk";
  riskTolerance: number;
  horizon: "short" | "medium" | "long";
}

export interface OptimizationResult {
  expectedReturn: number;
  expectedRisk: number;
  sharpeRatio: number;
  allocation: Array<{
    asset: string;
    percentage: number;
  }>;
}
