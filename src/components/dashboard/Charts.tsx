"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const COLORS = ["#074F57", "#077187", "#74A57F", "#9ECE9A", "#E4C5AF", "#b8b8b8", "#6b7280"];

interface ChartData {
  name: string;
  value: number;
}

interface BarChartCardProps {
  title: string;
  data: ChartData[];
  horizontal?: boolean;
}

export function BarChartCard({ title, data, horizontal = false }: BarChartCardProps) {
  if (horizontal) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <h3 className="text-sm font-medium">{title}</h3>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={Math.max(200, data.length * 40)}>
            <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={180} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#074F57" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <h3 className="text-sm font-medium">{title}</h3>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ left: -10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#074F57" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface PieChartCardProps {
  title: string;
  data: ChartData[];
}

export function PieChartCard({ title, data }: PieChartCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <h3 className="text-sm font-medium">{title}</h3>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
              }
              labelLine={false}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface SideBySideBarProps {
  title: string;
  data: { name: string; left: number; right: number }[];
  leftLabel: string;
  rightLabel: string;
}

export function SideBySideBarChart({
  title,
  data,
  leftLabel,
  rightLabel,
}: SideBySideBarProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <h3 className="text-sm font-medium">{title}</h3>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ left: -10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="left" name={leftLabel} fill="#074F57" radius={[4, 4, 0, 0]} />
            <Bar dataKey="right" name={rightLabel} fill="#9ECE9A" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
