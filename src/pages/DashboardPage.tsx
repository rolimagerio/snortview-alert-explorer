
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { TopItemsWidget } from "@/components/TopItemsWidget";
import { EventsChart } from "@/components/EventsChart";
import { StatCard } from "@/components/StatCard";
import { fetchDashboardStats } from "@/services/mockData";
import { DashboardStats } from "@/types/alert";
import { DatabaseIcon, FilterIcon } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{
    startDate?: Date;
    endDate?: Date;
  }>({});

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        const startDateStr = dateRange.startDate?.toISOString();
        const endDateStr = dateRange.endDate?.toISOString();
        
        const data = await fetchDashboardStats(startDateStr, endDateStr);
        setStats(data);
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadStats();
  }, [dateRange.startDate, dateRange.endDate]);

  const handleDateRangeChange = (startDate?: Date, endDate?: Date) => {
    setDateRange({ startDate, endDate });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto py-6 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        <DateRangeFilter onFilterChange={handleDateRangeChange} />
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <StatCard
            title="Total de Registros Bloqueados"
            value={stats?.blockedTotal || 0}
            icon={<FilterIcon className="h-4 w-4 text-muted-foreground" />}
            loading={loading}
          />
          <StatCard
            title="Total de Registros"
            value={loading ? "..." : stats ? stats.topSourceIPs.reduce((acc, item) => acc + item.count, 0) : 0}
            icon={<DatabaseIcon className="h-4 w-4 text-muted-foreground" />}
            loading={loading}
          />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <TopItemsWidget
            title="Top 10 IPs de Origem"
            items={stats?.topSourceIPs || []}
            loading={loading}
          />
          <TopItemsWidget
            title="Top 10 IPs de Destino"
            items={stats?.topDestinationIPs || []}
            loading={loading}
          />
          <TopItemsWidget
            title="Top Portas de Destino"
            items={stats?.topDestinationPorts || []}
            loading={loading}
          />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <EventsChart
            data={stats?.eventsByDay || []}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
