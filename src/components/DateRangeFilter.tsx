
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface DateRangeFilterProps {
  onFilterChange: (startDate: Date | undefined, endDate: Date | undefined) => void;
}

export function DateRangeFilter({ onFilterChange }: DateRangeFilterProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);

  const handleApplyFilter = () => {
    onFilterChange(startDate, endDate);
  };

  const handleClearFilter = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    onFilterChange(undefined, undefined);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "PPP", { locale: ptBR }) : "Data inicial"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => {
                setStartDate(date);
                setIsStartOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <span className="mx-2">até</span>

        <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "PPP", { locale: ptBR }) : "Data final"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={(date) => {
                setEndDate(date);
                setIsEndOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleApplyFilter}>Aplicar</Button>
        <Button variant="outline" onClick={handleClearFilter}>Limpar</Button>
      </div>
    </div>
  );
}
