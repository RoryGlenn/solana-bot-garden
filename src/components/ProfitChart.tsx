
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ProfitData } from "@/types";

interface ProfitChartProps {
  dailyData: ProfitData[];
  weeklyData: ProfitData[];
  monthlyData: ProfitData[];
  totalProfit: number;
}

const ProfitChart = ({ dailyData, weeklyData, monthlyData, totalProfit }: ProfitChartProps) => {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
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
    
    switch (period) {
      case 'daily':
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case 'weekly':
        return date.toLocaleDateString([], { weekday: 'short' });
      case 'monthly':
        return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
    }
  };

  const getCurrentData = () => {
    switch (period) {
      case 'daily':
        return dailyData;
      case 'weekly':
        return weeklyData;
      case 'monthly':
        return monthlyData;
    }
  };

  const currentData = getCurrentData();
  const dataHasPositiveValues = currentData.some(item => item.value > 0);
  const dataHasNegativeValues = currentData.some(item => item.value < 0);
  
  return (
    <Card className="border backdrop-blur-sm bg-white/90 dark:bg-black/30">
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
        <Tabs value={period} onValueChange={(value) => setPeriod(value as any)} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
          <TabsContent value={period} className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9945FF" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#9945FF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF4569" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FF4569" stopOpacity={0}/>
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
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  }}
                />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(200, 200, 200, 0.2)" />
                {dataHasPositiveValues && (
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
                )}
                {dataHasNegativeValues && (
                  <Area 
                    type="monotone" 
                    dataKey={(data) => (data.value < 0 ? Math.abs(data.value) : null)}
                    stroke="#FF4569" 
                    fillOpacity={1}
                    fill="url(#colorLoss)" 
                    isAnimationActive={true}
                    animationDuration={1000}
                    animationEasing="ease-out"
                    activeDot={{ r: 6, stroke: '#FF4569', strokeWidth: 2, fill: 'white' }}
                    dot={{ stroke: '#FF4569', strokeWidth: 1, fill: 'white', r: 3 }}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProfitChart;
