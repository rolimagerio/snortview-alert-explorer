
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

interface EventsChartProps {
  data: { date: string; count: number }[];
  loading?: boolean;
}

export function EventsChart({ data, loading = false }: EventsChartProps) {
  // Preparar dados para o gráfico (simplificar datas)
  const chartData = data.map(item => ({
    date: item.date.split('-').slice(1).join('/'), // Formatar como MM/DD
    count: item.count
  }));

  return (
    <Card className="col-span-2 h-full">
      <CardHeader>
        <CardTitle className="text-lg">Eventos por Dia</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-full h-4/5 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ) : data.length > 0 ? (
          <ChartContainer
            config={{
              events: {
                color: "#2563eb",
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                />
                <Bar dataKey="count" name="events" fill="var(--color-events)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Nenhum dado disponível
          </div>
        )}
      </CardContent>
    </Card>
  );
}
