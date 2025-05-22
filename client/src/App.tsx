import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Sidebar from "@/components/layout/sidebar";
import Home from "@/pages/home";
import News from "@/pages/news";
import Analyze from "@/pages/analyze";
import AddData from "@/pages/add-data";
import UploadCSV from "@/pages/upload-csv";
import PortfolioReport from "@/pages/portfolio-report";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="flex min-h-screen bg-[#1a1a2e]">
      <Sidebar />
      <div className="ml-64 flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/news" component={News} />
          <Route path="/analyze" component={Analyze} />
          <Route path="/add-data" component={AddData} />
          <Route path="/upload" component={UploadCSV} />
          <Route path="/report" component={PortfolioReport} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
