import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUploadCSV } from "@/hooks/use-portfolio";
import { parseCSV, validatePortfolioData } from "@/lib/financial-calculations";
import { Upload, CloudUpload, CheckCircle, AlertCircle } from "lucide-react";

export default function UploadCSV() {
  const [, setLocation] = useLocation();
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [validationResults, setValidationResults] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const uploadCSV = useUploadCSV();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = parseCSV(text);
      const validation = validatePortfolioData(parsed);
      
      setUploadedData(parsed);
      setValidationResults(validation);
      setShowPreview(true);
    } catch (error) {
      console.error("Error parsing CSV:", error);
    }
  };

  const handleProceedToAnalysis = async () => {
    if (validationResults?.valid.length > 0) {
      uploadCSV.mutate(validationResults.valid, {
        onSuccess: () => {
          setLocation("/report");
        }
      });
    }
  };

  const handleUploadNewFile = () => {
    setUploadedData([]);
    setValidationResults(null);
    setShowPreview(false);
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-[#e4e6ea]">Upload Portfolio Data</h1>
        <p className="text-[#8b949e]">Upload your portfolio data in CSV format for instant analysis</p>
      </div>

      <div className="max-w-4xl mx-auto">
        {!showPreview ? (
          <>
            {/* Upload Section */}
            <Card className="bg-[rgba(26,26,46,0.8)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)] mb-8">
              <CardContent className="p-8 text-center">
                <div className="w-24 h-24 bg-[#0f3460]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CloudUpload className="text-[#0f3460] h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-[#e4e6ea]">Upload CSV File</h3>
                <p className="text-[#8b949e] mb-8">Drag and drop your CSV file here, or click to browse</p>
                
                <div className="border-2 border-dashed border-gray-600 rounded-2xl p-12 hover:border-[#0f3460] transition-colors duration-200 cursor-pointer mb-6">
                  <input 
                    type="file" 
                    accept=".csv" 
                    onChange={handleFileUpload}
                    className="hidden" 
                    id="csvFileInput"
                  />
                  <label htmlFor="csvFileInput" className="cursor-pointer">
                    <Upload className="h-12 w-12 text-[#8b949e] mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2 text-[#e4e6ea]">Click to upload your CSV file</p>
                    <p className="text-sm text-[#8b949e]">Maximum file size: 10MB</p>
                  </label>
                </div>

                <Button 
                  onClick={() => document.getElementById('csvFileInput')?.click()}
                  className="bg-[#0f3460] hover:bg-[#0f3460]/80 text-[#e4e6ea] px-8 py-3 font-medium"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
              </CardContent>
            </Card>

            {/* CSV Format Guidelines */}
            <Card className="bg-[rgba(26,26,46,0.8)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)]">
              <CardHeader>
                <CardTitle className="flex items-center text-[#e4e6ea]">
                  <CheckCircle className="text-[#0f3460] mr-2 h-5 w-5" />
                  CSV Format Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium mb-3 text-[#e4e6ea]">Required Columns</h5>
                    <ul className="space-y-2 text-sm">
                      {[
                        { label: "Name", desc: "Stock/Asset name" },
                        { label: "Units", desc: "Number of shares/units" },
                        { label: "Buying Price", desc: "Purchase price per unit" },
                        { label: "Purchase Date", desc: "Date of purchase (YYYY-MM-DD)" },
                        { label: "Type", desc: "Stock, SIP, or Crypto" }
                      ].map((item) => (
                        <li key={item.label} className="flex items-center space-x-2">
                          <CheckCircle className="h-3 w-3 text-[#00d4aa]" />
                          <span className="text-[#e4e6ea]">
                            <strong>{item.label}:</strong> {item.desc}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-3 text-[#e4e6ea]">Sample Data</h5>
                    <div className="bg-[#16213e] rounded-xl p-4 font-mono text-xs overflow-x-auto">
                      <div className="text-[#00d4aa] mb-2">Name,Units,Buying Price,Purchase Date,Type</div>
                      <div className="space-y-1 text-[#e4e6ea]">
                        <div>Reliance Industries,100,2400.50,2023-01-15,Stock</div>
                        <div>HDFC Bank,50,1650.75,2023-02-20,Stock</div>
                        <div>TCS,25,3800.00,2023-03-10,Stock</div>
                        <div>Bitcoin,0.5,2500000,2023-04-05,Crypto</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          /* Data Preview */
          <Card className="bg-[rgba(26,26,46,0.8)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-[#e4e6ea]">
                  <CheckCircle className="text-[#00d4aa] mr-2 h-5 w-5" />
                  Data Preview
                </CardTitle>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-[#8b949e]">
                    <span className="text-[#00d4aa] font-medium">{validationResults?.valid.length || 0}</span> valid rows,
                    <span className="text-[#ff6b6b] font-medium ml-1">{validationResults?.invalid.length || 0}</span> errors
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-left py-3 px-4 text-[#e4e6ea]">Status</th>
                      <th className="text-left py-3 px-4 text-[#e4e6ea]">Name</th>
                      <th className="text-left py-3 px-4 text-[#e4e6ea]">Units</th>
                      <th className="text-left py-3 px-4 text-[#e4e6ea]">Buying Price</th>
                      <th className="text-left py-3 px-4 text-[#e4e6ea]">Purchase Date</th>
                      <th className="text-left py-3 px-4 text-[#e4e6ea]">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedData.slice(0, 10).map((row, index) => {
                      const isValid = validationResults?.valid.includes(row);
                      return (
                        <tr key={index} className="border-b border-gray-700 hover:bg-[#16213e]/50">
                          <td className="py-3 px-4">
                            {isValid ? (
                              <CheckCircle className="h-4 w-4 text-[#00d4aa]" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-[#ff6b6b]" />
                            )}
                          </td>
                          <td className="py-3 px-4 font-medium text-[#e4e6ea]">{row.name}</td>
                          <td className="py-3 px-4 font-mono text-[#e4e6ea]">{row.units}</td>
                          <td className="py-3 px-4 font-mono text-[#e4e6ea]">₹{row.buyingPrice}</td>
                          <td className="py-3 px-4 font-mono text-[#e4e6ea]">{row.purchaseDate}</td>
                          <td className="py-3 px-4">
                            <span className="bg-[#00d4aa]/20 text-[#00d4aa] text-xs px-2 py-1 rounded-lg">
                              {row.type}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {validationResults?.errors.length > 0 && (
                <div className="mt-6 p-4 bg-[#ff6b6b]/10 border border-[#ff6b6b]/20 rounded-lg">
                  <h5 className="font-medium text-[#ff6b6b] mb-2">Validation Errors</h5>
                  <ul className="text-sm text-[#8b949e] space-y-1">
                    {validationResults.errors.slice(0, 5).map((error: string, index: number) => (
                      <li key={index}>• {error}</li>
                    ))}
                    {validationResults.errors.length > 5 && (
                      <li>• ... and {validationResults.errors.length - 5} more errors</li>
                    )}
                  </ul>
                </div>
              )}

              <div className="flex justify-center space-x-4 mt-6">
                <Button 
                  variant="outline" 
                  onClick={handleUploadNewFile}
                  className="border-gray-600 hover:bg-gray-600 text-[#e4e6ea] px-6 py-3 font-medium"
                >
                  Upload New File
                </Button>
                <Button 
                  onClick={handleProceedToAnalysis}
                  disabled={!validationResults?.valid.length || uploadCSV.isPending}
                  className="bg-[#00d4aa] hover:bg-[#00d4aa]/80 text-[#1a1a2e] px-6 py-3 font-medium"
                >
                  Proceed to Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
