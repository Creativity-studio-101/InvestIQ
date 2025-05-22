import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useMarketData = () => {
  return useQuery({
    queryKey: ["/api/market-data"],
    queryFn: api.getMarketData,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useMarketDataBySymbol = (symbol: string) => {
  return useQuery({
    queryKey: ["/api/market-data", symbol],
    queryFn: () => api.getMarketDataBySymbol(symbol),
    enabled: !!symbol,
  });
};

export const useNews = (category?: string) => {
  return useQuery({
    queryKey: ["/api/news", category],
    queryFn: () => api.getNews(category),
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};

export const useStockSearch = (query: string) => {
  return useQuery({
    queryKey: ["/api/stocks/search", query],
    queryFn: () => api.searchStocks(query),
    enabled: query.length > 2,
  });
};
