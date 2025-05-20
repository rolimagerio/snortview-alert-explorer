import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { SnortAlert } from "@/types/alert";
import { fetchAlerts } from "@/services/mockData";

export default function SearchPage() {
  const [alerts, setAlerts] = useState<SnortAlert[]>([]);
  const [totalAlerts, setTotalAlerts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof SnortAlert>("datetime_fix");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // Filtros
  const [filters, setFilters] = useState({
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    srcAddr: "",
    dstAddr: "",
    dstPort: "",
    proto: "",
    action: "",
    searchTerm: "",
    searchField: "msg" as "msg" | "class"
  });

  // Opções para filtros
  const protoOptions = ["TCP", "UDP", "ICMP", "HTTP", "DNS"];
  const actionOptions = ["allow", "deny", "alert", "block", "drop"];

  const handleDateRangeChange = (startDate?: Date, endDate?: Date) => {
    setFilters(prev => ({
      ...prev,
      startDate,
      endDate
    }));
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadAlerts();
  };

  const handleClearFilters = () => {
    setFilters({
      startDate: undefined,
      endDate: undefined,
      srcAddr: "",
      dstAddr: "",
      dstPort: "",
      proto: "",
      action: "",
      searchTerm: "",
      searchField: "msg"
    });
    setCurrentPage(1);
  };

  const handleSortChange = (field: keyof SnortAlert) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const filterParams = {
        startDate: filters.startDate?.toISOString(),
        endDate: filters.endDate?.toISOString(),
        srcAddr: filters.srcAddr || undefined,
        dstAddr: filters.dstAddr || undefined,
        dstPort: filters.dstPort ? parseInt(filters.dstPort) : undefined,
        proto: filters.proto || undefined,
        action: filters.action || undefined,
        searchTerm: filters.searchTerm || undefined,
        searchField: filters.searchField
      };
      
      const { data, total } = await fetchAlerts(
        currentPage, 
        perPage, 
        filterParams,
        sortField,
        sortOrder
      );
      
      setAlerts(data);
      setTotalAlerts(total);
    } catch (error) {
      console.error("Error loading alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [currentPage, perPage, sortField, sortOrder]);

  // Parse URL params for filtering if coming from TopItemsWidget click
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    // Set filter values from URL parameters
    const srcAddr = params.get('srcAddr');
    const dstAddr = params.get('dstAddr');
    const dstPort = params.get('dstPort');
    
    if (srcAddr || dstAddr || dstPort) {
      const updatedFilters = { ...filters };
      
      if (srcAddr) updatedFilters.srcAddr = srcAddr;
      if (dstAddr) updatedFilters.dstAddr = dstAddr;
      if (dstPort) updatedFilters.dstPort = dstPort;
      
      setFilters(updatedFilters);
      
      // Trigger search with these filters
      setTimeout(() => loadAlerts(), 0);
    }
  }, []);

  const totalPages = Math.ceil(totalAlerts / perPage);

  const getSortIndicator = (field: keyof SnortAlert) => {
    if (field !== sortField) return null;
    return sortOrder === "asc" ? " ▲" : " ▼";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto py-6 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-6">Busca Detalhada</h1>
        
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">Filtros</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="searchTerm">Buscar por</Label>
              <div className="flex mt-1">
                <Select 
                  value={filters.searchField}
                  onValueChange={(value) => handleFilterChange("searchField", value)}
                >
                  <SelectTrigger className="w-[120px] rounded-r-none">
                    <SelectValue placeholder="Campo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="msg">Mensagem</SelectItem>
                    <SelectItem value="class">Classe</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="searchTerm"
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
                  placeholder="Digite para buscar..."
                  className="rounded-l-none"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="srcAddr">IP de Origem</Label>
              <Input
                id="srcAddr"
                value={filters.srcAddr}
                onChange={(e) => handleFilterChange("srcAddr", e.target.value)}
                placeholder="Ex: 192.168.1.1"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="dstAddr">IP de Destino</Label>
              <Input
                id="dstAddr"
                value={filters.dstAddr}
                onChange={(e) => handleFilterChange("dstAddr", e.target.value)}
                placeholder="Ex: 10.0.0.1"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="dstPort">Porta de Destino</Label>
              <Input
                id="dstPort"
                value={filters.dstPort}
                onChange={(e) => handleFilterChange("dstPort", e.target.value)}
                placeholder="Ex: 80"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="proto">Protocolo</Label>
              <Select 
                value={filters.proto}
                onValueChange={(value) => handleFilterChange("proto", value)}
              >
                <SelectTrigger id="proto" className="mt-1">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {protoOptions.map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="action">Ação</Label>
              <Select 
                value={filters.action}
                onValueChange={(value) => handleFilterChange("action", value)}
              >
                <SelectTrigger id="action" className="mt-1">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {actionOptions.map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mb-4">
            <Label className="mb-2 block">Intervalo de Datas</Label>
            <DateRangeFilter onFilterChange={handleDateRangeChange} />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClearFilters}>
              Limpar Filtros
            </Button>
            <Button onClick={handleSearch}>
              Buscar
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Resultados</h2>
              <div className="text-sm text-muted-foreground">
                {totalAlerts} registros encontrados
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center">Carregando...</div>
            ) : alerts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      onClick={() => handleSortChange("id")}
                      className="cursor-pointer hover:bg-slate-50"
                    >
                      ID{getSortIndicator("id")}
                    </TableHead>
                    <TableHead 
                      onClick={() => handleSortChange("datetime_fix")}
                      className="cursor-pointer hover:bg-slate-50"
                    >
                      Data{getSortIndicator("datetime_fix")}
                    </TableHead>
                    <TableHead 
                      onClick={() => handleSortChange("src_addr")}
                      className="cursor-pointer hover:bg-slate-50"
                    >
                      IP Origem{getSortIndicator("src_addr")}
                    </TableHead>
                    <TableHead 
                      onClick={() => handleSortChange("src_port")}
                      className="cursor-pointer hover:bg-slate-50"
                    >
                      Porta Origem{getSortIndicator("src_port")}
                    </TableHead>
                    <TableHead 
                      onClick={() => handleSortChange("dst_addr")}
                      className="cursor-pointer hover:bg-slate-50"
                    >
                      IP Destino{getSortIndicator("dst_addr")}
                    </TableHead>
                    <TableHead 
                      onClick={() => handleSortChange("dst_port")}
                      className="cursor-pointer hover:bg-slate-50"
                    >
                      Porta Destino{getSortIndicator("dst_port")}
                    </TableHead>
                    <TableHead 
                      onClick={() => handleSortChange("proto")}
                      className="cursor-pointer hover:bg-slate-50"
                    >
                      Protocolo{getSortIndicator("proto")}
                    </TableHead>
                    <TableHead 
                      onClick={() => handleSortChange("action")}
                      className="cursor-pointer hover:bg-slate-50"
                    >
                      Ação{getSortIndicator("action")}
                    </TableHead>
                    <TableHead 
                      onClick={() => handleSortChange("msg")}
                      className="cursor-pointer hover:bg-slate-50"
                    >
                      Mensagem{getSortIndicator("msg")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>{alert.id}</TableCell>
                      <TableCell>{new Date(alert.datetime_fix).toLocaleString()}</TableCell>
                      <TableCell>{alert.src_addr}</TableCell>
                      <TableCell>{alert.src_port}</TableCell>
                      <TableCell>{alert.dst_addr}</TableCell>
                      <TableCell>{alert.dst_port}</TableCell>
                      <TableCell>{alert.proto}</TableCell>
                      <TableCell>{alert.action}</TableCell>
                      <TableCell className="max-w-xs truncate" title={alert.msg}>
                        {alert.msg}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                Nenhum resultado encontrado
              </div>
            )}
          </div>
          
          {totalPages > 1 && (
            <div className="p-4 border-t">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      aria-disabled={currentPage === 1}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageToShow = totalPages <= 5 
                      ? i + 1 
                      : currentPage <= 3 
                        ? i + 1 
                        : currentPage >= totalPages - 2 
                          ? totalPages - 4 + i 
                          : currentPage - 2 + i;
                          
                    return (
                      <PaginationItem key={i}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageToShow)}
                          isActive={currentPage === pageToShow}
                        >
                          {pageToShow}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      aria-disabled={currentPage === totalPages}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
