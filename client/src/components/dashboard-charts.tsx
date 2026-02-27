import { useMemo } from "react";
import { format, parseISO, subDays } from "date-fns";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from "recharts";
import { useTransactions } from "@/hooks/use-transactions";
import { Loader2 } from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  Food: "#F87171",      // Red
  Rent: "#60A5FA",      // Blue
  Transport: "#FBBF24", // Yellow
  Tech: "#A78BFA",      // Purple
  Utilities: "#34D399", // Green
  Salary: "#34D399",    // Green (Income)
  Other: "#9CA3AF"      // Gray
};

export function DashboardCharts() {
  const { data: transactions, isLoading } = useTransactions();

  const { barData, pieData } = useMemo(() => {
    if (!transactions) return { barData: [], pieData: [] };

    // --- Bar Chart Data (Last 7 Days) ---
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), 6 - i);
      return format(d, "MMM dd");
    });

    const barDataMap = last7Days.reduce((acc, date) => {
      acc[date] = { date, income: 0, expense: 0 };
      return acc;
    }, {} as Record<string, { date: string, income: number, expense: number }>);

    transactions.forEach(tx => {
      const dateStr = format(new Date(tx.date), "MMM dd");
      if (barDataMap[dateStr]) {
        if (tx.type === "income") barDataMap[dateStr].income += Number(tx.amount);
        if (tx.type === "expense") barDataMap[dateStr].expense += Number(tx.amount);
      }
    });

    // --- Pie Chart Data (Expenses by Category) ---
    const expenseTxs = transactions.filter(t => t.type === "expense");
    const categoryMap = expenseTxs.reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + Number(tx.amount);
      return acc;
    }, {} as Record<string, number>);

    const pieData = Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return { 
      barData: Object.values(barDataMap), 
      pieData 
    };
  }, [transactions]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="h-[400px] bg-card rounded-2xl animate-pulse flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
        <div className="h-[400px] bg-card rounded-2xl animate-pulse flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-white/10 shadow-xl rounded-xl p-4">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-muted-foreground capitalize">{entry.name}:</span>
              <span className="font-semibold text-foreground">
                ${entry.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="bg-card border border-white/5 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-semibold mb-6" style={{ fontFamily: "var(--font-display)" }}>Cash Flow</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
              <Bar dataKey="income" name="Income" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="expense" name="Expense" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col">
        <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "var(--font-display)" }}>Expenses by Category</h3>
        {pieData.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            No expenses recorded yet.
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || CATEGORY_COLORS.Other} />
                  ))}
                </Pie>
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                  formatter={(value) => <span className="text-muted-foreground text-sm">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
