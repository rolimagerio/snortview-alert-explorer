
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
  Cell,
  LabelList
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
  
  // Create a deeper copy of items to avoid modifying the original data
  const chartData = [...items]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map(item => ({
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

  // Define different color schemes based on filter type
  const getColorScheme = () => {
    switch(filterType) {
      case "srcAddr":
        return ["#8B5CF6", "#A78BFA", "#C4B5FD", "#DDD6FE", "#EDE9FE"]; // Purples for source IPs
      case "dstAddr":
        return ["#0EA5E9", "#38BDF8", "#7DD3FC", "#BAE6FD", "#E0F2FE"]; // Blues for destination IPs
      case "dstPort":
        return ["#F97316", "#FB923C", "#FDBA74", "#FED7AA", "#FFEDD5"]; // Oranges for ports
      default:
        return ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"]; // Default blues
    }
  };
  
  const colors = getColorScheme();
  const getColor = (index: number) => colors[index % colors.length];

  const renderChart = () => (
    <ChartContainer className="h-[360px] w-full" config={{}}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
        >
          <XAxis type="number" />
          <YAxis 
            type="category" 
            dataKey="name" 
            width={150}
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
            name={title}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === activeIndex ? colors[0] : getColor(index)}
              />
            ))}
            <LabelList dataKey="value" position="right" />
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
