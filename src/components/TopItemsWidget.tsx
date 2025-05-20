
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopItem } from "@/types/alert";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface TopItemsWidgetProps {
  title: string;
  items: TopItem[];
  loading?: boolean;
  filterType?: "srcAddr" | "dstAddr" | "dstPort";
}

export function TopItemsWidget({ 
  title, 
  items, 
  loading = false, 
  filterType 
}: TopItemsWidgetProps) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const chartData = items.map(item => ({
    name: item.label,
    value: item.count
  }));

  const handleBarClick = (data: any, index: number) => {
    setActiveIndex(index);
    
    if (!filterType) return;
    
    const filterValue = data.name;
    
    const filterParams = new URLSearchParams();
    filterParams.append(filterType, filterValue);
    
    toast({
      title: "Filtro aplicado",
      description: `Filtrando por ${filterValue}`,
    });
    
    navigate({
      pathname: "/search",
      search: `?${filterParams.toString()}`
    });
  };

  const colors = ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"];
  const getColor = (index: number) => colors[index % colors.length];

  const renderChart = () => (
    <ChartContainer className="h-[200px] w-full" config={{}}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical">
          <XAxis type="number" hide />
          <YAxis 
            type="category" 
            dataKey="name" 
            width={120}
            tick={{ fontSize: 12 }}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(200, 200, 200, 0.2)' }}
            content={<ChartTooltipContent />}
          />
          <Bar 
            dataKey="value" 
            onClick={handleBarClick} 
            className="cursor-pointer"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === activeIndex ? "#1d4ed8" : getColor(index)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {Array(5).fill(0).map((_, index) => (
              <div key={index} className="flex justify-between">
                <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-1/4 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : items.length > 0 ? (
          renderChart()
        ) : (
          <div className="text-center text-muted-foreground py-4">
            Nenhum dado disponível
          </div>
        )}
      </CardContent>
    </Card>
  );
}
