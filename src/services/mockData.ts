
import { SnortAlert, DashboardStats, TopItem } from "@/types/alert";

// Exemplo de alerta baseado no fornecido
const sampleAlert: SnortAlert = {
  id: 1,
  timestamp: "05/01-03:50:02.196054",
  iface: 4,
  src_addr: "172.25.0.51",
  src_port: 53,
  dst_addr: "172.20.2.14",
  dst_port: 43713,
  proto: "UDP",
  action: "allow",
  msg: "PROTOCOL-DNS dns response for rfc1918 172.16/12 address detected",
  priority: 1,
  class: "Potential Corporate Privacy Violation",
  sid: 15934,
  rule: "1:15934:12",
  b64_data: "vt+FgAABAAEAAAAAEEFUQlIyTU9OSVVTSlBWWDEDd3d3B3VzanRyZWUDY29tAmJyAAABAAHADAABAAEAAA4QAASsGQB9",
  datetime: "01/05/2025 03:50:02:196054",
  datetime_fix: "2025-05-01 03:50:02.196054"
};

// Gerar dados mock aleatórios
const generateMockAlerts = (count: number): SnortAlert[] => {
  const alerts: SnortAlert[] = [];
  const actions = ["allow", "deny", "alert", "block", "drop"];
  const protocols = ["TCP", "UDP", "ICMP", "HTTP", "DNS"];
  const classes = [
    "Potential Corporate Privacy Violation",
    "Attempted Information Leak",
    "Web Application Attack",
    "Attempted Denial of Service",
    "Attempted User Privilege Gain",
    "Executable Code was Detected",
    "A Network Trojan was Detected",
    "Potentially Bad Traffic"
  ];
  
  const messages = [
    "PROTOCOL-DNS dns response for rfc1918 address detected",
    "INDICATOR-SCAN DNS version.bind string information disclosure attempt",
    "SERVER-APACHE Apache Struts remote code execution attempt",
    "MALWARE-CNC Win.Trojan.ZeroAccess outbound connection",
    "INDICATOR-OBFUSCATION JSFuck JavaScript obfuscation detected",
    "SERVER-WEBAPP Jenkins remote code execution attempt",
    "MALWARE-CNC Andr.Trojan.Dharma ransomware outbound connection attempt",
    "PROTOCOL-ICMP destination unreachable communication administratively prohibited",
    "OS-WINDOWS Microsoft Windows SMB remote code execution attempt"
  ];

  // Criar data base para alertas
  const startDate = new Date("2025-04-01");
  const endDate = new Date("2025-05-20");
  const dayRange = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

  for (let i = 0; i < count; i++) {
    // Gerar IPs aleatórios
    const srcOctet1 = Math.floor(Math.random() * 223) + 1;
    const srcOctet2 = Math.floor(Math.random() * 255);
    const srcOctet3 = Math.floor(Math.random() * 255);
    const srcOctet4 = Math.floor(Math.random() * 255);
    
    const dstOctet1 = Math.floor(Math.random() * 223) + 1;
    const dstOctet2 = Math.floor(Math.random() * 255);
    const dstOctet3 = Math.floor(Math.random() * 255);
    const dstOctet4 = Math.floor(Math.random() * 255);
    
    // Gerar data aleatória
    const randomDays = Math.floor(Math.random() * dayRange);
    const alertDate = new Date(startDate.getTime() + randomDays * 24 * 60 * 60 * 1000);
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    const seconds = Math.floor(Math.random() * 60);
    const milliseconds = Math.floor(Math.random() * 1000);
    
    alertDate.setHours(hours, minutes, seconds, milliseconds);
    
    // Formatar data para os formatos necessários
    const dateFormatted = alertDate.toISOString().replace('T', ' ').slice(0, -1);
    const dateParts = alertDate.toLocaleDateString('pt-BR').split('/');
    const timeParts = alertDate.toTimeString().split(' ')[0] + '.' + alertDate.getMilliseconds();
    const timestamp = `${dateParts[0]}/${dateParts[1]}-${timeParts}`;
    
    const alert: SnortAlert = {
      id: i + 1,
      timestamp: timestamp,
      iface: Math.floor(Math.random() * 10),
      src_addr: `${srcOctet1}.${srcOctet2}.${srcOctet3}.${srcOctet4}`,
      src_port: Math.floor(Math.random() * 65535),
      dst_addr: `${dstOctet1}.${dstOctet2}.${dstOctet3}.${dstOctet4}`,
      dst_port: Math.floor(Math.random() * 65535),
      proto: protocols[Math.floor(Math.random() * protocols.length)],
      action: actions[Math.floor(Math.random() * actions.length)],
      msg: messages[Math.floor(Math.random() * messages.length)],
      priority: Math.floor(Math.random() * 3) + 1,
      class: classes[Math.floor(Math.random() * classes.length)],
      sid: Math.floor(Math.random() * 100000),
      rule: `1:${Math.floor(Math.random() * 100000)}:${Math.floor(Math.random() * 20)}`,
      b64_data: sampleAlert.b64_data, // Reutilizar os mesmos dados base64
      datetime: alertDate.toLocaleString('pt-BR').replace(',', ''),
      datetime_fix: dateFormatted
    };
    
    alerts.push(alert);
  }
  
  return alerts;
};

// Armazenar os alertas em um array global para simular o banco de dados
const globalAlerts = generateMockAlerts(1000);

// Função para buscar alertas com filtros e paginação
export const fetchAlerts = async (
  page: number = 1,
  perPage: number = 10,
  filters: {
    startDate?: string;
    endDate?: string;
    srcAddr?: string;
    dstAddr?: string;
    dstPort?: number;
    proto?: string;
    action?: string;
    searchTerm?: string;
    searchField?: 'msg' | 'class';
  } = {},
  sortField: keyof SnortAlert = 'datetime_fix',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<{ data: SnortAlert[], total: number }> => {
  // Simular tempo de resposta do banco de dados
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let filteredAlerts = [...globalAlerts];
  
  // Aplicar filtros
  if (filters.startDate && filters.endDate) {
    const startDate = new Date(filters.startDate).getTime();
    const endDate = new Date(filters.endDate).getTime();
    
    filteredAlerts = filteredAlerts.filter(alert => {
      const alertDate = new Date(alert.datetime_fix).getTime();
      return alertDate >= startDate && alertDate <= endDate;
    });
  }
  
  if (filters.srcAddr) {
    filteredAlerts = filteredAlerts.filter(alert => 
      alert.src_addr.includes(filters.srcAddr || '')
    );
  }
  
  if (filters.dstAddr) {
    filteredAlerts = filteredAlerts.filter(alert => 
      alert.dst_addr.includes(filters.dstAddr || '')
    );
  }
  
  if (filters.dstPort) {
    filteredAlerts = filteredAlerts.filter(alert => 
      alert.dst_port === filters.dstPort
    );
  }
  
  if (filters.proto) {
    filteredAlerts = filteredAlerts.filter(alert => 
      alert.proto === filters.proto
    );
  }
  
  if (filters.action) {
    filteredAlerts = filteredAlerts.filter(alert => 
      alert.action === filters.action
    );
  }
  
  if (filters.searchTerm && filters.searchField) {
    filteredAlerts = filteredAlerts.filter(alert => 
      alert[filters.searchField!].toLowerCase().includes(filters.searchTerm!.toLowerCase())
    );
  }
  
  // Ordenar resultados
  filteredAlerts.sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    } else {
      // Para valores numéricos
      return sortOrder === 'asc' 
        ? (aValue as number) - (bValue as number) 
        : (bValue as number) - (aValue as number);
    }
  });
  
  // Calcular paginação
  const startIndex = (page - 1) * perPage;
  const paginatedAlerts = filteredAlerts.slice(startIndex, startIndex + perPage);
  
  return {
    data: paginatedAlerts,
    total: filteredAlerts.length
  };
};

// Função para obter as estatísticas para o dashboard
export const fetchDashboardStats = async (
  startDate?: string,
  endDate?: string
): Promise<DashboardStats> => {
  // Simular tempo de resposta do banco de dados
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredAlerts = [...globalAlerts];
  
  // Aplicar filtros de data se fornecidos
  if (startDate && endDate) {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    
    filteredAlerts = filteredAlerts.filter(alert => {
      const alertDate = new Date(alert.datetime_fix).getTime();
      return alertDate >= start && alertDate <= end;
    });
  }
  
  // Calcular Top 10 IPs de origem
  const sourceIPMap = new Map<string, number>();
  filteredAlerts.forEach(alert => {
    const count = sourceIPMap.get(alert.src_addr) || 0;
    sourceIPMap.set(alert.src_addr, count + 1);
  });
  
  const topSourceIPs: TopItem[] = Array.from(sourceIPMap.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  // Calcular Top 10 IPs de destino
  const destIPMap = new Map<string, number>();
  filteredAlerts.forEach(alert => {
    const count = destIPMap.get(alert.dst_addr) || 0;
    destIPMap.set(alert.dst_addr, count + 1);
  });
  
  const topDestinationIPs: TopItem[] = Array.from(destIPMap.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  // Calcular Top portas de destino
  const destPortMap = new Map<string, number>();
  filteredAlerts.forEach(alert => {
    const portLabel = `${alert.dst_port}`;
    const count = destPortMap.get(portLabel) || 0;
    destPortMap.set(portLabel, count + 1);
  });
  
  const topDestinationPorts: TopItem[] = Array.from(destPortMap.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  // Calcular total de registros bloqueados
  const blockedTotal = filteredAlerts.filter(
    alert => alert.action === 'deny' || alert.action === 'block' || alert.action === 'drop'
  ).length;
  
  // Calcular eventos por dia
  const eventsByDayMap = new Map<string, number>();
  filteredAlerts.forEach(alert => {
    const date = alert.datetime_fix.split(' ')[0]; // Extrair só a data
    const count = eventsByDayMap.get(date) || 0;
    eventsByDayMap.set(date, count + 1);
  });
  
  const eventsByDay = Array.from(eventsByDayMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
  
  return {
    topSourceIPs,
    topDestinationIPs,
    topDestinationPorts,
    blockedTotal,
    eventsByDay
  };
};
