import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UserGuideModal from "@/components/layout/user-guide-modal";
import { Edit, Upload, CheckCircle } from "lucide-react";

export default function Analyze() {
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    // Show user guide modal when page loads
    setShowGuide(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1a2e] px-8 py-8">
      <UserGuideModal open={showGuide} onClose={() => setShowGuide(false)} />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-[#e4e6ea]">Portfolio Analysis</h1>
        <p className="text-[#8b949e]">Choose how you'd like to add your portfolio data for comprehensive analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Manual Entry Option */}
        <Link href="/add-data">
          <Card className="bg-[rgba(26,26,46,0.8)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)] hover:scale-105 transition-all duration-300 cursor-pointer">
            <CardContent className="p-8 text-center">
              <div className="w-24 h-24 bg-[#00d4aa]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Edit className="text-[#00d4aa] h-8 w-8" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-[#e4e6ea]">Add Data Manually</h3>
              <p className="text-[#8b949e] mb-6">
                Enter your holdings one by one with our intuitive form. Perfect for smaller portfolios or when you want full control.
              </p>
              <div className="space-y-2 text-sm text-[#8b949e] mb-8">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-[#00d4aa]" />
                  <span>Auto-complete stock suggestions</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-[#00d4aa]" />
                  <span>Real-time price fetching</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-[#00d4aa]" />
                  <span>Support for stocks, SIPs, and crypto</span>
                </div>
              </div>
              <Button className="w-full bg-[#00d4aa] hover:bg-[#00d4aa]/80 text-[#1a1a2e] font-medium">
                Start Adding <Edit className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        {/* CSV Upload Option */}
        <Link href="/upload">
          <Card className="bg-[rgba(26,26,46,0.8)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)] hover:scale-105 transition-all duration-300 cursor-pointer">
            <CardContent className="p-8 text-center">
              <div className="w-24 h-24 bg-[#0f3460]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="text-[#0f3460] h-8 w-8" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-[#e4e6ea]">Upload CSV File</h3>
              <p className="text-[#8b949e] mb-6">
                Have your data in a spreadsheet? Upload it directly for instant analysis. Supports standard portfolio formats.
              </p>
              <div className="space-y-2 text-sm text-[#8b949e] mb-8">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-[#00d4aa]" />
                  <span>Bulk data import</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-[#00d4aa]" />
                  <span>Data validation & preview</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-[#00d4aa]" />
                  <span>Standard CSV format support</span>
                </div>
              </div>
              <Button className="w-full bg-[#0f3460] hover:bg-[#0f3460]/80 text-[#e4e6ea] font-medium">
                Upload File <Upload className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Sample CSV Format */}
      <div className="max-w-2xl mx-auto mt-12">
        <Card className="bg-[rgba(26,26,46,0.8)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)]">
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4 flex items-center text-[#e4e6ea]">
              <CheckCircle className="text-[#0f3460] mr-2 h-5 w-5" />
              Expected CSV Format
            </h4>
            <div className="bg-[#16213e] rounded-xl p-4 font-mono text-sm overflow-x-auto">
              <div className="text-[#8b949e] mb-2"># CSV Header (Required)</div>
              <div className="text-[#00d4aa]">Name,Units,Buying Price,Purchase Date,Type</div>
              <div className="text-[#8b949e] mt-2 mb-1"># Example data rows</div>
              <div className="text-[#e4e6ea]">Reliance Industries,100,2400.50,2023-01-15,Stock</div>
              <div className="text-[#e4e6ea]">HDFC Bank,50,1650.75,2023-02-20,Stock</div>
              <div className="text-[#e4e6ea]">Bitcoin,0.5,2500000,2023-03-10,Crypto</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
