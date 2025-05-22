import { useState } from "react";
import { Button } from "@/components/ui/button";
import NewsCard from "@/components/news/news-card";
import { useNews } from "@/hooks/use-market-data";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function News() {
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const { data: news, isLoading } = useNews(activeCategory);

  const categories = [
    { id: undefined, label: "All News" },
    { id: "indian", label: "Indian Markets" },
    { id: "international", label: "International Markets" }
  ];

  return (
    <div className="min-h-screen bg-[#1a1a2e] px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-[#e4e6ea]">Market News</h1>
        <p className="text-[#8b949e]">Stay updated with the latest financial news and market insights</p>
      </div>

      {/* News Categories */}
      <div className="flex space-x-6 mb-8">
        {categories.map((category) => (
          <Button
            key={category.id || "all"}
            onClick={() => setActiveCategory(category.id)}
            className={cn(
              "px-6 py-3 rounded-xl font-medium transition-all duration-200",
              activeCategory === category.id
                ? "bg-[#00d4aa] text-[#1a1a2e]"
                : "bg-transparent border border-gray-600 text-[#e4e6ea] hover:bg-white/10"
            )}
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-[rgba(26,26,46,0.8)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)] rounded-2xl overflow-hidden">
              <Skeleton className="w-full h-48" />
              <div className="p-6">
                <div className="flex space-x-2 mb-3">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-6 w-full mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="flex justify-between">
                  <div className="flex space-x-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <div>
                      <Skeleton className="h-3 w-16 mb-1" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          ))
        ) : (
          news?.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))
        )}
      </div>

      {!isLoading && (!news || news.length === 0) && (
        <div className="text-center py-12">
          <p className="text-[#8b949e] text-lg">No news articles found for the selected category.</p>
        </div>
      )}
    </div>
  );
}
