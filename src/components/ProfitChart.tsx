
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ProfitData } from "@/types";

interface ProfitChartProps {
  monthlyData: ProfitData[];
  totalProfit: number;
}

const ProfitChart = ({ monthlyData, totalProfit }: ProfitChartProps) => {
  const formatChartValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (timestamp: Date) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
  };
  
  return (
    <Card className="border backdrop-blur-sm bg-black/30 glass-dark">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Profit Overview</CardTitle>
            <CardDescription>Track your bot performance</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-muted-foreground">Total Profit</p>
            <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatChartValue(totalProfit)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9945FF" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#9945FF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatDate}
                tick={{ fontSize: 12 }}
                stroke="#888888"
                tickLine={false}
              />
              <YAxis 
                tickFormatter={formatChartValue}
                tick={{ fontSize: 12 }}
                stroke="#888888"
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                formatter={(value) => [formatChartValue(value as number), 'Profit']}
                labelFormatter={(label) => formatDate(label as Date)}
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                  padding: '8px 12px',
                  backgroundColor: 'rgba(20, 20, 30, 0.95)',
                  color: '#fff'
                }}
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(200, 200, 200, 0.1)" />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#9945FF" 
                fillOpacity={1}
                fill="url(#colorProfit)" 
                isAnimationActive={true}
                animationDuration={1000}
                animationEasing="ease-out"
                activeDot={{ r: 6, stroke: '#9945FF', strokeWidth: 2, fill: 'white' }}
                dot={{ stroke: '#9945FF', strokeWidth: 1, fill: 'white', r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfitChart;
