import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import MarketIndices from "@/components/market/market-indices";
import TopMovers from "@/components/market/top-movers";
import CryptoPrices from "@/components/market/crypto-prices";
import NewsCard from "@/components/news/news-card";
import { useNews } from "@/hooks/use-market-data";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const { data: news, isLoading: newsLoading } = useNews();

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0f3460] via-[#16213e] to-[#1a1a2e] px-8 py-12 mb-8">
        <div 
          className="relative overflow-hidden rounded-3xl"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e] via-[#1a1a2e]/80 to-transparent"></div>
          <div className="relative z-10 py-16 px-12">
            <h1 className="text-5xl font-bold mb-4 text-[#e4e6ea] animate-fade-in">
              Smart Portfolio Management
            </h1>
            <p className="text-xl text-[#8b949e] mb-8 animate-fade-in">
              for Indian Investors
            </p>
            <div className="flex space-x-4 animate-slide-up">
              <Link href="/analyze">
                <Button className="bg-[#00d4aa] hover:bg-[#00d4aa]/80 text-[#1a1a2e] px-8 py-3 font-medium transform hover:scale-105 transition-all duration-200">
                  Analyze Portfolio
                </Button>
              </Link>
              <Link href="/news">
                <Button variant="outline" className="border-white/30 hover:bg-white/10 text-[#e4e6ea] px-8 py-3 font-medium transition-all duration-200">
                  View Market News
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Market Indices */}
      <div className="px-8 mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-[#e4e6ea]">Major Indices</h2>
        <MarketIndices />
      </div>

      {/* Top Gainers & Losers */}
      <div className="px-8 mb-8">
        <TopMovers />
      </div>

      {/* Crypto Prices */}
      <div className="px-8 mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-[#e4e6ea]">Cryptocurrency Prices</h2>
        <CryptoPrices />
      </div>

      {/* Latest News */}
      <div className="px-8 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-[#e4e6ea]">Latest Financial News</h2>
          <Link href="/news">
            <Button variant="ghost" className="text-[#00d4aa] hover:text-[#00d4aa]/80">
              See All News <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-[rgba(26,26,46,0.8)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)] rounded-2xl overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-6">
                  <Skeleton className="h-4 w-20 mb-3" />
                  <Skeleton className="h-6 w-full mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            news?.slice(0, 6).map((article) => (
              <NewsCard key={article.id} article={article} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
