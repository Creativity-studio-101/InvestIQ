import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreatePortfolioItem } from "@/hooks/use-portfolio";
import { useStockSearch, useMarketDataBySymbol } from "@/hooks/use-market-data";
import { formatCurrency, calculateTotalInvestment } from "@/lib/financial-calculations";
import { Plus } from "lucide-react";

const portfolioItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  units: z.string().min(1, "Units is required"),
  buyingPrice: z.string().min(1, "Buying price is required"),
  purchaseDate: z.string().min(1, "Purchase date is required"),
  type: z.enum(["Stock", "SIP", "Crypto"]),
});

type FormData = z.infer<typeof portfolioItemSchema>;

export default function PortfolioForm() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStock, setSelectedStock] = useState<any>(null);
  
  const createPortfolioItem = useCreatePortfolioItem();
  const { data: stockResults } = useStockSearch(searchQuery);
  const { data: currentPrice } = useMarketDataBySymbol(selectedStock?.symbol || "");
  
  const form = useForm<FormData>({
    resolver: zodResolver(portfolioItemSchema),
    defaultValues: {
      name: "",
      units: "",
      buyingPrice: "",
      purchaseDate: "",
      type: "Stock",
    },
  });

  const watchedValues = form.watch();
  const units = parseFloat(watchedValues.units) || 0;
  const buyingPrice = parseFloat(watchedValues.buyingPrice) || 0;
  const totalInvestment = calculateTotalInvestment(units, buyingPrice);
  const currentValue = currentPrice ? units * parseFloat(currentPrice.price) : totalInvestment;

  const onSubmit = (data: FormData) => {
    createPortfolioItem.mutate({
      ...data,
      symbol: selectedStock?.symbol,
    });
    
    // Reset form
    form.reset();
    setSelectedStock(null);
    setSearchQuery("");
  };

  const handleStockSelect = (stock: any) => {
    setSelectedStock(stock);
    form.setValue("name", stock.name);
    setSearchQuery("");
  };

  return (
    <Card className="bg-[rgba(26,26,46,0.8)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)]">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-[#e4e6ea]">Add New Holding</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Stock Search */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#e4e6ea]">Stock/Asset Name</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Search for stocks (e.g., Reliance, TCS, HDFC Bank)"
                        className="bg-[#16213e] border-gray-600 text-[#e4e6ea] pr-10"
                        onChange={(e) => {
                          field.onChange(e);
                          setSearchQuery(e.target.value);
                        }}
                      />
                    </FormControl>
                    {stockResults && stockResults.length > 0 && searchQuery && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-[#16213e] border border-gray-600 rounded-lg max-h-48 overflow-y-auto z-10">
                        {stockResults.map((stock: any) => (
                          <div
                            key={stock.symbol}
                            className="p-3 hover:bg-[#0f3460] cursor-pointer text-[#e4e6ea]"
                            onClick={() => handleStockSelect(stock)}
                          >
                            {stock.name} ({stock.symbol})
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="units"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#e4e6ea]">Number of Units</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="100"
                        className="bg-[#16213e] border-gray-600 text-[#e4e6ea]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="buyingPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#e4e6ea]">Buying Price (₹)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        placeholder="2400.50"
                        className="bg-[#16213e] border-gray-600 text-[#e4e6ea]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#e4e6ea]">Purchase Date</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        className="bg-[#16213e] border-gray-600 text-[#e4e6ea]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#e4e6ea]">Investment Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-[#16213e] border-gray-600 text-[#e4e6ea]">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#16213e] border-gray-600">
                        <SelectItem value="Stock">Stock</SelectItem>
                        <SelectItem value="SIP">SIP</SelectItem>
                        <SelectItem value="Crypto">Crypto</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Current Price Display */}
            <div className="bg-[#0f3460]/20 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#8b949e]">Current Market Price:</span>
                <span className="font-mono font-semibold text-lg text-[#e4e6ea]">
                  {currentPrice ? formatCurrency(parseFloat(currentPrice.price)) : "--"}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-[#8b949e]">Total Investment:</span>
                <span className="font-mono font-semibold text-[#e4e6ea]">
                  {formatCurrency(totalInvestment)}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-[#8b949e]">Current Value:</span>
                <span className="font-mono font-semibold text-[#00d4aa]">
                  {formatCurrency(currentValue)}
                </span>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#00d4aa] hover:bg-[#00d4aa]/80 text-[#1a1a2e] font-medium"
              disabled={createPortfolioItem.isPending}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add to Portfolio
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
