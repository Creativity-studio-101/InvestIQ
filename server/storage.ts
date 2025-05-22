import { 
  users, 
  portfolioItems, 
  marketData, 
  newsArticles,
  type User, 
  type InsertUser,
  type PortfolioItem,
  type InsertPortfolioItem,
  type MarketData,
  type InsertMarketData,
  type NewsArticle,
  type InsertNewsArticle
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Portfolio methods
  getPortfolioItems(userId?: number): Promise<PortfolioItem[]>;
  createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem>;
  updatePortfolioItem(id: number, updates: Partial<PortfolioItem>): Promise<PortfolioItem | undefined>;
  deletePortfolioItem(id: number): Promise<boolean>;

  // Market data methods
  getMarketData(): Promise<MarketData[]>;
  getMarketDataBySymbol(symbol: string): Promise<MarketData | undefined>;
  upsertMarketData(data: InsertMarketData): Promise<MarketData>;

  // News methods
  getNewsArticles(category?: string): Promise<NewsArticle[]>;
  createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private portfolioItems: Map<number, PortfolioItem>;
  private marketData: Map<string, MarketData>;
  private newsArticles: Map<number, NewsArticle>;
  private currentUserId: number;
  private currentPortfolioItemId: number;
  private currentMarketDataId: number;
  private currentNewsId: number;

  constructor() {
    this.users = new Map();
    this.portfolioItems = new Map();
    this.marketData = new Map();
    this.newsArticles = new Map();
    this.currentUserId = 1;
    this.currentPortfolioItemId = 1;
    this.currentMarketDataId = 1;
    this.currentNewsId = 1;

    // Initialize with sample market data
    this.initializeMarketData();
    this.initializeNewsData();
  }

  private initializeMarketData() {
    const sampleMarketData = [
      { symbol: "NIFTY50", name: "NIFTY 50", price: "19674.25", change: "234.50", changePercent: "1.2" },
      { symbol: "SENSEX", name: "SENSEX", price: "65995.63", change: "523.20", changePercent: "0.8" },
      { symbol: "NIFTYBANK", name: "NIFTY BANK", price: "45821.30", change: "-145.75", changePercent: "-0.3" },
      { symbol: "RELIANCE", name: "Reliance Industries", price: "2456.75", change: "124.25", changePercent: "5.2" },
      { symbol: "TCS", name: "Tata Consultancy Services", price: "3892.40", change: "179.60", changePercent: "4.8" },
      { symbol: "HDFCBANK", name: "HDFC Bank", price: "1678.90", change: "63.15", changePercent: "3.9" },
      { symbol: "ADANIENT", name: "Adani Enterprises", price: "2234.50", change: "-78.50", changePercent: "-3.4" },
      { symbol: "BAJFINANCE", name: "Bajaj Finance", price: "6789.25", change: "-195.75", changePercent: "-2.8" },
      { symbol: "INFY", name: "Infosys", price: "1456.80", change: "-31.20", changePercent: "-2.1" },
      { symbol: "BTC", name: "Bitcoin", price: "43256.78", change: "1015.22", changePercent: "2.4" },
      { symbol: "ETH", name: "Ethereum", price: "2789.45", change: "49.35", changePercent: "1.8" },
      { symbol: "SOL", name: "Solana", price: "98.67", change: "-1.23", changePercent: "-1.2" },
      { symbol: "ADA", name: "Cardano", price: "0.4567", change: "0.0137", changePercent: "3.1" }
    ];

    sampleMarketData.forEach((data, index) => {
      const marketItem: MarketData = {
        id: index + 1,
        symbol: data.symbol,
        name: data.name,
        price: data.price,
        change: data.change,
        changePercent: data.changePercent,
        updatedAt: new Date()
      };
      this.marketData.set(data.symbol, marketItem);
    });
  }

  private initializeNewsData() {
    const sampleNews = [
      {
        title: "RBI Announces New Monetary Policy: Interest Rates to Remain Unchanged",
        summary: "The Reserve Bank of India maintains its current stance on interest rates, citing inflation concerns and economic stability factors in their latest policy review...",
        content: "Full article content...",
        source: "Economic Times",
        category: "indian",
        imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        sourceUrl: "https://economictimes.com",
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        title: "Sensex Hits New All-Time High Amid Strong Q3 Earnings",
        summary: "Indian stock markets rally as major corporations report better-than-expected quarterly results, driving investor confidence to new heights...",
        content: "Full article content...",
        source: "Business Standard",
        category: "indian",
        imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        sourceUrl: "https://business-standard.com",
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
      },
      {
        title: "Federal Reserve Signals Potential Rate Changes in 2024",
        summary: "The US Federal Reserve Chairman hinted at possible monetary policy adjustments in response to evolving economic conditions and inflation trends...",
        content: "Full article content...",
        source: "Reuters",
        category: "international",
        imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        sourceUrl: "https://reuters.com",
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
      }
    ];

    sampleNews.forEach((article, index) => {
      const newsItem: NewsArticle = {
        id: index + 1,
        title: article.title,
        summary: article.summary,
        content: article.content,
        source: article.source,
        category: article.category,
        imageUrl: article.imageUrl,
        sourceUrl: article.sourceUrl,
        publishedAt: article.publishedAt,
        createdAt: new Date()
      };
      this.newsArticles.set(index + 1, newsItem);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getPortfolioItems(userId?: number): Promise<PortfolioItem[]> {
    const items = Array.from(this.portfolioItems.values());
    if (userId) {
      return items.filter(item => item.userId === userId);
    }
    return items;
  }

  async createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem> {
    const id = this.currentPortfolioItemId++;
    const portfolioItem: PortfolioItem = { 
      ...item, 
      id, 
      userId: 1, // Default user for demo
      currentPrice: null,
      createdAt: new Date()
    };
    this.portfolioItems.set(id, portfolioItem);
    return portfolioItem;
  }

  async updatePortfolioItem(id: number, updates: Partial<PortfolioItem>): Promise<PortfolioItem | undefined> {
    const item = this.portfolioItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...updates };
    this.portfolioItems.set(id, updatedItem);
    return updatedItem;
  }

  async deletePortfolioItem(id: number): Promise<boolean> {
    return this.portfolioItems.delete(id);
  }

  async getMarketData(): Promise<MarketData[]> {
    return Array.from(this.marketData.values());
  }

  async getMarketDataBySymbol(symbol: string): Promise<MarketData | undefined> {
    return this.marketData.get(symbol);
  }

  async upsertMarketData(data: InsertMarketData): Promise<MarketData> {
    const existing = this.marketData.get(data.symbol);
    const id = existing?.id || this.currentMarketDataId++;
    const marketItem: MarketData = {
      ...data,
      id,
      updatedAt: new Date()
    };
    this.marketData.set(data.symbol, marketItem);
    return marketItem;
  }

  async getNewsArticles(category?: string): Promise<NewsArticle[]> {
    const articles = Array.from(this.newsArticles.values());
    if (category) {
      return articles.filter(article => article.category === category);
    }
    return articles.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }

  async createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle> {
    const id = this.currentNewsId++;
    const newsItem: NewsArticle = {
      ...article,
      id,
      createdAt: new Date()
    };
    this.newsArticles.set(id, newsItem);
    return newsItem;
  }
}

export const storage = new MemStorage();
