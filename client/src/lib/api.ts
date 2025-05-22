import { apiRequest } from "./queryClient";

export const api = {
  // Market data
  getMarketData: () => fetch("/api/market-data").then(res => res.json()),
  getMarketDataBySymbol: (symbol: string) => fetch(`/api/market-data/${symbol}`).then(res => res.json()),
  
  // News
  getNews: (category?: string) => {
    const url = category ? `/api/news?category=${category}` : "/api/news";
    return fetch(url).then(res => res.json());
  },
  
  // Portfolio
  getPortfolio: () => fetch("/api/portfolio").then(res => res.json()),
  createPortfolioItem: (data: any) => apiRequest("POST", "/api/portfolio", data),
  updatePortfolioItem: (id: number, data: any) => apiRequest("PUT", `/api/portfolio/${id}`, data),
  deletePortfolioItem: (id: number) => apiRequest("DELETE", `/api/portfolio/${id}`),
  uploadCSV: (csvData: any[]) => apiRequest("POST", "/api/portfolio/upload-csv", { csvData }),
  
  // Analysis
  getPortfolioAnalysis: () => fetch("/api/portfolio/analysis").then(res => res.json()),
  
  // Stock search
  searchStocks: (query: string) => fetch(`/api/stocks/search?q=${encodeURIComponent(query)}`).then(res => res.json()),
};
