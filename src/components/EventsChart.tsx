
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface EventsChartProps {
  data: { date: string; count: number }[];
  loading?: boolean;
}

export function EventsChart({ data, loading = false }: EventsChartProps) {
  // Preparar dados para o gráfico (simplificar datas)
  const chartData = data.map(item => ({
    date: item.date.split('-').slice(1).join('/'), // Formatar como MM/DD
    count: item.count,
    // Simular dados de bloqueados (30-40% dos eventos totais) e permitidos (resto)
    blocked: Math.round(item.count * (0.3 + Math.random() * 0.1)),
    allowed: Math.round(item.count * (0.6 + Math.random() * 0.1))
  }));

  return (
    <Card className="col-span-2">
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
              blocked: {
                color: "#ea384c",
              },
              allowed: {
                color: "#22c55e",
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData} 
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                barGap={0}
                barCategoryGap={8}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Legend />
                <Tooltip
                  content={<ChartTooltipContent />}
                  cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                />
                <Bar dataKey="count" name="Total de eventos" fill="#2563eb" />
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
