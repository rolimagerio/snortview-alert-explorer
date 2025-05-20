
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopItem } from "@/types/alert";

interface TopItemsWidgetProps {
  title: string;
  items: TopItem[];
  loading?: boolean;
}

export function TopItemsWidget({ title, items, loading = false }: TopItemsWidgetProps) {
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
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="font-medium truncate">{item.label}</div>
                <div className="text-sm text-muted-foreground">{item.count}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-4">
            Nenhum dado disponível
          </div>
        )}
      </CardContent>
    </Card>
  );
}
