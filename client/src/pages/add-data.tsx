import { useRouter } from "wouter";
import PortfolioForm from "@/components/portfolio/portfolio-form";
import PortfolioTable from "@/components/portfolio/portfolio-table";

export default function AddData() {
  const [, navigate] = useRouter();

  const handleAnalyze = () => {
    navigate("/report");
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-[#e4e6ea]">Add Portfolio Holdings</h1>
        <p className="text-[#8b949e]">Enter your investment details to build your portfolio</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PortfolioForm />
        <PortfolioTable onAnalyze={handleAnalyze} />
      </div>
    </div>
  );
}
