
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

interface EventsStatusChartProps {
  data: { date: string; count: number }[];
  loading?: boolean;
}

export function EventsStatusChart({ data, loading = false }: EventsStatusChartProps) {
  // Preparar dados para o gráfico (simplificar datas e adicionar dados de status)
  const chartData = data.map(item => ({
    date: item.date.split('-').slice(1).join('/'), // Formatar como MM/DD
    // Simular dados de bloqueados (30-40% dos eventos totais) e permitidos (resto)
    blocked: Math.round(item.count * (0.3 + Math.random() * 0.1)),
    allowed: Math.round(item.count * (0.6 + Math.random() * 0.1))
  }));

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-lg">Status de Eventos por Dia</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-full h-4/5 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ) : data.length > 0 ? (
          <ChartContainer
            config={{
              blocked: {
                color: "#ea384c",
                label: "Bloqueados",
              },
              allowed: {
                color: "#22c55e",
                label: "Permitidos",
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
                <Legend />
                <Bar dataKey="blocked" name="blocked" fill="var(--color-blocked)" />
                <Bar dataKey="allowed" name="allowed" fill="var(--color-allowed)" />
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
