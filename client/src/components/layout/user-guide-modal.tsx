import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BarChart3, CheckCircle } from "lucide-react";

interface UserGuideModalProps {
  open: boolean;
  onClose: () => void;
}

export default function UserGuideModal({ open, onClose }: UserGuideModalProps) {
  const steps = [
    {
      title: "Add Your Holdings",
      description: "Manually enter your stocks or upload a CSV file with your portfolio data"
    },
    {
      title: "Analyze Performance", 
      description: "Get detailed analysis including risk metrics, returns, and optimization suggestions"
    },
    {
      title: "Download Reports",
      description: "Export your analysis as PDF or CSV for further review"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[rgba(26,26,46,0.95)] backdrop-blur-lg border border-[rgba(255,255,255,0.1)] text-[#e4e6ea]">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 bg-[#00d4aa]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="text-[#00d4aa] text-2xl" />
          </div>
          <DialogTitle className="text-2xl font-semibold mb-2">Welcome to Portfolio Analyzer</DialogTitle>
          <p className="text-[#8b949e]">Get comprehensive insights into your investment portfolio</p>
        </DialogHeader>
        
        <div className="space-y-4 my-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-[#0f3460] rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                <span className="text-xs font-semibold text-[#e4e6ea]">{index + 1}</span>
              </div>
              <div>
                <h3 className="font-medium mb-1 text-[#e4e6ea]">{step.title}</h3>
                <p className="text-sm text-[#8b949e]">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <Button 
          onClick={onClose}
          className="w-full bg-[#00d4aa] hover:bg-[#00d4aa]/80 text-[#1a1a2e] font-medium"
        >
          Get Started
        </Button>
      </DialogContent>
    </Dialog>
  );
}
