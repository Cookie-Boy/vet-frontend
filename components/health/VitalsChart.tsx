// components/health/VitalsChart.tsx
"use client";

import { useState } from "react";
import { useVitalsHistory } from "@/hooks/useHealthData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format, parseISO } from "date-fns";

interface VitalsChartProps {
  petId: string;
}

export function VitalsChart({ petId }: VitalsChartProps) {
  const [period, setPeriod] = useState("day");
  const { data: vitals } = useVitalsHistory(petId, period);

  const chartData = vitals?.map(v => ({
    time: format(parseISO(v.timestamp), "HH:mm"),
    heartRate: v.heartRate,
    respiratoryRate: v.respiratoryRate,
    temperature: v.temperature,
    isAnomalous: v.isAnomalous,
  })) || [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((p: any) => (
            <p key={p.name} style={{ color: p.color }}>
              {p.name}: {p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>История показателей</CardTitle>
        <Select value={period} onValueChange={(value) => setPeriod(value ?? "day")}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">День</SelectItem>
            <SelectItem value="week">Неделя</SelectItem>
            <SelectItem value="month">Месяц</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Нет данных за выбранный период</p>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="heartRate" name="Пульс" stroke="#ef4444" strokeWidth={2} />
              <Line yAxisId="left" type="monotone" dataKey="respiratoryRate" name="Дыхание" stroke="#3b82f6" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="temperature" name="Температура" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}