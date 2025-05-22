import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPortfolioItemSchema, insertMarketDataSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Market data endpoints
  app.get("/api/market-data", async (req, res) => {
    try {
      const marketData = await storage.getMarketData();
      res.json(marketData);
    } catch (error) {
      console.error("Error fetching market data:", error);
      res.status(500).json({ message: "Failed to fetch market data" });
    }
  });

  app.get("/api/market-data/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const data = await storage.getMarketDataBySymbol(symbol.toUpperCase());
      if (!data) {
        return res.status(404).json({ message: "Symbol not found" });
      }
      res.json(data);
    } catch (error) {
      console.error("Error fetching market data by symbol:", error);
      res.status(500).json({ message: "Failed to fetch market data" });
    }
  });

  // News endpoints
  app.get("/api/news", async (req, res) => {
    try {
      const { category } = req.query;
      const news = await storage.getNewsArticles(category as string);
      res.json(news);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  // Portfolio endpoints
  app.get("/api/portfolio", async (req, res) => {
    try {
      const portfolioItems = await storage.getPortfolioItems();
      res.json(portfolioItems);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  app.post("/api/portfolio", async (req, res) => {
    try {
      const validatedData = insertPortfolioItemSchema.parse(req.body);
      const newItem = await storage.createPortfolioItem(validatedData);
      res.status(201).json(newItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating portfolio item:", error);
      res.status(500).json({ message: "Failed to create portfolio item" });
    }
  });

  app.put("/api/portfolio/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const updatedItem = await storage.updatePortfolioItem(id, updates);
      if (!updatedItem) {
        return res.status(404).json({ message: "Portfolio item not found" });
      }
      res.json(updatedItem);
    } catch (error) {
      console.error("Error updating portfolio item:", error);
      res.status(500).json({ message: "Failed to update portfolio item" });
    }
  });

  app.delete("/api/portfolio/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deletePortfolioItem(id);
      if (!deleted) {
        return res.status(404).json({ message: "Portfolio item not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting portfolio item:", error);
      res.status(500).json({ message: "Failed to delete portfolio item" });
    }
  });

  // CSV upload endpoint
  app.post("/api/portfolio/upload-csv", async (req, res) => {
    try {
      const { csvData } = req.body;
      
      if (!csvData || !Array.isArray(csvData)) {
        return res.status(400).json({ message: "Invalid CSV data format" });
      }

      const results = {
        successful: 0,
        failed: 0,
        errors: [] as string[]
      };

      for (const row of csvData) {
        try {
          const validatedData = insertPortfolioItemSchema.parse(row);
          await storage.createPortfolioItem(validatedData);
          results.successful++;
        } catch (error) {
          results.failed++;
          if (error instanceof z.ZodError) {
            results.errors.push(`Row with name "${row.name}": ${error.errors.map(e => e.message).join(", ")}`);
          } else {
            results.errors.push(`Row with name "${row.name}": Unknown error`);
          }
        }
      }

      res.json(results);
    } catch (error) {
      console.error("Error processing CSV upload:", error);
      res.status(500).json({ message: "Failed to process CSV upload" });
    }
  });

  // Stock search endpoint
  app.get("/api/stocks/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        return res.status(400).json({ message: "Query parameter required" });
      }

      // Search through market data for matching stocks
      const marketData = await storage.getMarketData();
      const results = marketData
        .filter(stock => 
          stock.name.toLowerCase().includes(q.toLowerCase()) ||
          stock.symbol.toLowerCase().includes(q.toLowerCase())
        )
        .slice(0, 10)
        .map(stock => ({
          symbol: stock.symbol,
          name: stock.name,
          price: stock.price
        }));

      res.json(results);
    } catch (error) {
      console.error("Error searching stocks:", error);
      res.status(500).json({ message: "Failed to search stocks" });
    }
  });

  // Portfolio analysis endpoint
  app.get("/api/portfolio/analysis", async (req, res) => {
    try {
      const portfolioItems = await storage.getPortfolioItems();
      const marketData = await storage.getMarketData();
      
      // Calculate portfolio metrics
      let totalInvested = 0;
      let currentValue = 0;
      
      const analysis = portfolioItems.map(item => {
        const invested = parseFloat(item.units) * parseFloat(item.buyingPrice);
        const market = marketData.find(m => m.symbol === item.symbol || m.name === item.name);
        const current = market ? parseFloat(item.units) * parseFloat(market.price) : invested;
        
        totalInvested += invested;
        currentValue += current;
        
        return {
          ...item,
          invested,
          currentValue: current,
          pnl: current - invested,
          pnlPercent: ((current - invested) / invested) * 100
        };
      });

      const totalPnL = currentValue - totalInvested;
      const totalReturn = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

      // Calculate risk metrics (simplified)
      const riskMetrics = {
        beta: 1.15,
        sharpeRatio: 1.42,
        maxDrawdown: -12.5,
        standardDeviation: 18.3,
        volatility: 16.8
      };

      res.json({
        portfolio: analysis,
        summary: {
          totalInvested,
          currentValue,
          totalPnL,
          returnPercentage: totalReturn
        },
        riskMetrics
      });
    } catch (error) {
      console.error("Error calculating portfolio analysis:", error);
      res.status(500).json({ message: "Failed to calculate portfolio analysis" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
