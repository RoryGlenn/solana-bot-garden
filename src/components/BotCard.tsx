
import { Bot } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Activity, Clock, PlayCircle, PauseCircle, StopCircle, ChevronRight, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BotCardProps {
  bot: Bot;
  onPlay: (id: string) => void;
  onPause: (id: string) => void;
  onStop: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetails: (id: string) => void;
}

const BotCard = ({ bot, onPlay, onPause, onStop, onDelete, onViewDetails }: BotCardProps) => {
  const getBotTypeIcon = (type: string) => {
    switch (type) {
      case 'volume':
        return <Activity className="h-4 w-4" />;
      case 'trade':
        return <Activity className="h-4 w-4" />;
      case 'snipe':
        return <Activity className="h-4 w-4" />;
      case 'copy-trade':
        return <Activity className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case 'active':
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case 'paused':
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case 'stopped':
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "";
    }
  };

  const formatProfit = (profit: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(profit);
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md dark:hover:shadow-none dark:hover:bg-card/90 hover:-translate-y-1 border border-sidebar-border glass-dark">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-medium">{bot.name}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Badge variant="outline" className="mr-2 flex items-center gap-1 border-sidebar-border">
                {getBotTypeIcon(bot.type)}
                {bot.type.charAt(0).toUpperCase() + bot.type.slice(1).replace('-', ' ')}
              </Badge>
              <Badge className={cn("flex items-center gap-1", getStatusBadgeStyles(bot.status))}>
                {bot.status === 'active' && <span className="relative flex h-2 w-2 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>}
                {bot.status.charAt(0).toUpperCase() + bot.status.slice(1)}
              </Badge>
            </CardDescription>
          </div>
          <div className="flex flex-col items-end">
            <div className={`font-medium text-base ${bot.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatProfit(bot.profit)}
            </div>
            <div className="text-xs text-muted-foreground flex items-center mt-1">
              <Clock className="h-3 w-3 mr-1" />
              {formatDistanceToNow(new Date(bot.lastActive), { addSuffix: true })}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="text-sm mt-2">
          {bot.config.tradingPair && <div><span className="text-muted-foreground">Trading pair:</span> {bot.config.tradingPair}</div>}
          {bot.config.strategy && <div><span className="text-muted-foreground">Strategy:</span> {bot.config.strategy}</div>}
          {bot.config.risk && <div><span className="text-muted-foreground">Risk level:</span> {bot.config.risk.charAt(0).toUpperCase() + bot.config.risk.slice(1)}</div>}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="flex space-x-2">
          {bot.status !== 'active' && (
            <Button variant="outline" size="icon" className="h-8 w-8 border-sidebar-border bg-background/20" onClick={() => onPlay(bot.id)}>
              <PlayCircle className="h-4 w-4" />
            </Button>
          )}
          {bot.status === 'active' && (
            <Button variant="outline" size="icon" className="h-8 w-8 border-sidebar-border bg-background/20" onClick={() => onPause(bot.id)}>
              <PauseCircle className="h-4 w-4" />
            </Button>
          )}
          {bot.status !== 'stopped' && (
            <Button variant="outline" size="icon" className="h-8 w-8 border-sidebar-border bg-background/20" onClick={() => onStop(bot.id)}>
              <StopCircle className="h-4 w-4" />
            </Button>
          )}
          <Button variant="outline" size="icon" className="h-8 w-8 text-destructive border-sidebar-border bg-background/20" onClick={() => onDelete(bot.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="h-8" onClick={() => onViewDetails(bot.id)}>
          Details
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BotCard;
