import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Clock } from "lucide-react";
import { NewsArticle } from "@/types";

interface NewsCardProps {
  article: NewsArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "indian":
        return "bg-[#00d4aa]/20 text-[#00d4aa]";
      case "international":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-[#8b949e]/20 text-[#8b949e]";
    }
  };

  return (
    <Card className="bg-[rgba(26,26,46,0.8)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)] overflow-hidden hover:scale-105 transition-all duration-200">
      {article.imageUrl && (
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-48 object-cover"
        />
      )}
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 mb-3">
          <Badge className={`text-xs px-2 py-1 font-medium ${getCategoryColor(article.category)}`}>
            {article.category === "indian" ? "Markets" : "Global"}
          </Badge>
          <div className="flex items-center text-xs text-[#8b949e]">
            <Clock className="h-3 w-3 mr-1" />
            <span>{article.readTime || "3 min read"}</span>
          </div>
        </div>
        
        <h3 className="font-semibold text-lg mb-3 line-clamp-2 text-[#e4e6ea]">
          {article.title}
        </h3>
        
        {article.summary && (
          <p className="text-[#8b949e] text-sm mb-4 line-clamp-3">
            {article.summary}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-[#00d4aa] rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-[#1a1a2e]">
                {article.source.charAt(0)}
              </span>
            </div>
            <div className="text-xs">
              <div className="font-medium text-[#e4e6ea]">{article.source}</div>
              <div className="text-[#8b949e]">{formatTimeAgo(article.publishedAt)}</div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-[#00d4aa] hover:text-[#00d4aa]/80 hover:bg-[#00d4aa]/10"
            onClick={() => article.sourceUrl && window.open(article.sourceUrl, '_blank')}
          >
            Read More <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
