
export interface SnortAlert {
  id: number;
  timestamp: string;
  iface: number;
  src_addr: string;
  src_port: number;
  dst_addr: string;
  dst_port: number;
  proto: string;
  action: string;
  msg: string;
  priority: number;
  class: string;
  sid: number;
  rule: string;
  b64_data: string;
  datetime: string;
  datetime_fix: string;
}

export interface TopItem {
  label: string;
  count: number;
}

export interface DashboardStats {
  topSourceIPs: TopItem[];
  topDestinationIPs: TopItem[];
  topDestinationPorts: TopItem[];
  blockedTotal: number;
  eventsByDay: {
    date: string;
    count: number;
  }[];
}
