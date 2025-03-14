
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface PriceCardProps {
  price: number;
  title: string;
  description: string;
  features: string[];
  period?: string;
  popular?: boolean;
  className?: string;
  redirectToPayments?: boolean;
}

const PriceCard = ({
  price,
  title,
  description,
  features,
  period = "month",
  popular = false,
  className,
  redirectToPayments = false,
}: PriceCardProps) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (redirectToPayments) {
      navigate("/payments");
    } else {
      navigate("/signup");
    }
  };

  return (
    <div
      className={cn(
        "rounded-2xl p-6 flex flex-col justify-between transition-all duration-300",
        popular 
          ? "glass glow scale-105 border-solana/30" 
          : "glass-light hover:scale-[1.02] hover:glass",
        className
      )}
    >
      {popular && (
        <Badge className="self-start mb-4 bg-solana text-white border-0">
          Most Popular
        </Badge>
      )}

      <div>
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <p className="text-muted-foreground mb-4 text-sm">{description}</p>
        
        <div className="flex items-end gap-1 mb-6">
          <span className="text-3xl font-bold">{price}</span>
          <span className="text-xl font-medium text-solana">SOL</span>
          {period !== "one-time" && <span className="text-muted-foreground text-sm">/{period}</span>}
        </div>
        
        <ul className="space-y-2 mb-8">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <CheckIcon className="h-4 w-4 text-solana shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <Button 
        className={cn(
          "w-full transition-all duration-300",
          popular 
            ? "bg-gradient-to-r from-solana to-accent hover:shadow-lg hover:translate-y-[-1px]" 
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        )}
        onClick={handleGetStarted}
      >
        Get Started
      </Button>
    </div>
  );
};

export default PriceCard;
